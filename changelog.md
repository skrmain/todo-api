# Changelog

## 0.5

- Add Permission Based Access Control On Todo
- Update App Structure
- Implement Refresh Token API
- Add Swagger API Docs

## 0.4

- CHORE:
  - Docker Image Size Reduce
    - Container memory size reduced from ~ 62MB --> 52MB
    - Image size reduced from ~190MB --> 140MB
  - Create Script to build docker-image and tagging for docker-hub
- DOCS
  - Update Readme: Update Change-Logs, Move to Separate File
  - Add information about API in readme

## 0.3

- REFACTOR:
  - Make consistent Import and Export Syntax
  - Add `DocComment` in Util and Middleware, for editor auto complete
  - Define DB Operation in respective `controller` file only
  - Remove Unused and Extra Files
- CHORE: Updated `prettier`, `editorconfig` Configurations
- FIX:
  - Restrict (Update & Delete) operation on `todo` can be performed by only `user` Created that.
  - Consistent and Proper Error Handling, Proper Response Status Code
  - Make consistent Response Structure
- FEAT:
  - remove `auth` from auth routes
  - add `password` Encryption on registration
  - make `delete` status to `archive` for todo
- DOCS:
  - Add `api.rest` - With Payloads, All Routes, Headers

## 0.2

- todo, user, auth app

## 0.1

- todo app without authentication
