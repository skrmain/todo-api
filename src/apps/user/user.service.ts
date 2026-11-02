import userRepository from './user.repository';

class UserService {
    getOne(...args: Parameters<typeof userRepository.getOne>) {
        const [filter, select = ''] = args;
        return userRepository.getOne(filter, `-password -__v ${select}`);
    }

    getAll(...args: Parameters<typeof userRepository.getAll>) {
        const [filter = {}, select = ''] = args;
        return userRepository.getAll(filter, `-password -__v ${select}`);
    }

    create(...args: Parameters<typeof userRepository.create>) {
        return userRepository.create(...args);
    }

    updateOne(...args: Parameters<typeof userRepository.updateOne>) {
        return userRepository.updateOne(...args);
    }

    parseUser(user?: any) {
        return {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            createdAt: user?.createdAt,
        };
    }
}

export default new UserService();
