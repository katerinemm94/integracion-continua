export class ResponseAPI<T> {

    message: string;
    data: T;
    response: boolean;
    errors: any;
    errorAuth?: boolean;
    refreshToken?: boolean;
    errorPermissions?: boolean;

}
