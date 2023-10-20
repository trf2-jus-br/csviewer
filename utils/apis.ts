import createHttpError from "http-errors";

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
// import { ErrorResponse, Method } from "types/api";
import { ValidationError } from "yup";

type Method =
  |'GET'
  |'DELETE'
  |'HEAD'
  |'OPTIONS'
  |'POST'
  |'PUT'
  |'PATCH'
  |'PURGE'
  |'LINK'
  |'UNLINK';

type ApiMethodHandlers = {
    [key in Uppercase<Method>]?: NextApiHandler;
};

function errorHandler(err: unknown, res: NextApiResponse) {
    // Errors with statusCode >= 500 are should not be exposed
    if (createHttpError.isHttpError(err) && err.expose) {
        // Handle all errors thrown by http-errors module
        return res.status(err.statusCode).json({ error: { message: err.message } });
    // } else if (err instanceof ValidationError) {
    //     // Handle yup validation errors
    //     return res.status(400).json({ error: { message: err.errors.join(", ") } });
    } else {
        // default to 500 server error
        console.error(err);
        return res.status(500).json({
            error: { message: "Internal Server Error", err: err },
            status: createHttpError.isHttpError(err) ? err.statusCode : 500,
        });
    }
}

export function apiHandler(handler: ApiMethodHandlers) {
//    return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
        return async (req: NextApiRequest, res: NextApiResponse) => {
            try {
            const method = req.method
                ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
                : undefined;

            // check if handler supports current HTTP method
            if (!method)
                throw new createHttpError.MethodNotAllowed(
                    `Nenhum método disponível no caminho ${req.url}!`
                );

            const methodHandler = handler[method];
            if (!methodHandler)
                throw new createHttpError.MethodNotAllowed(
                    `Método ${req.method} não permitido no caminho ${req.url}!`
                );

            // call method handler
            await methodHandler(req, res);
        } catch (err) {
            // global error handler
            errorHandler(err, res);
        }
    };
}