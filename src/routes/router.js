import { sendJson } from '../utils/index.js';

function normalizePath(path) {
    if (path.length > 1 && path.endsWith('/')) {
        return path.slice(0, -1);
    }
    return path;
}

function matchRoute(routePath, requestPath) {
    const routeSegments = normalizePath(routePath).split('/').filter(Boolean);
    const requestSegments = normalizePath(requestPath).split('/').filter(Boolean);

    if (routeSegments.length !== requestSegments.length) {
        return null;
    }

    const params = {};
    for (let index = 0; index < routeSegments.length; index += 1) {
        const routeSegment = routeSegments[index];
        const requestSegment = requestSegments[index];

        if (routeSegment.startsWith(':')) {
            try {
                params[routeSegment.slice(1)] = decodeURIComponent(requestSegment);
            } catch {
                return null;
            }
        } else if (routeSegment !== requestSegment) {
            return null;
        }
    }

    return params;
}

export function createRouter() {
    const routes = [];

    return {
        add(method, path, handler) {
            routes.push({ method: method.toUpperCase(), path, handler });
        },
        async handle(req, res) {
            const { pathname } = new URL(req.url, 'http://localhost');
            let pathMatched = false;

            for (const route of routes) {
                const params = matchRoute(route.path, pathname);
                if (!params) {
                    continue;
                }

                pathMatched = true;
                if (route.method === req.method) {
                    await route.handler(req, res, { params });
                    return;
                }
            }

            if (pathMatched) {
                sendJson(res, 405, { error: 'Method not allowed' });
                return;
            }

            sendJson(res, 404, { error: 'Not found' });
        },
    };
}
