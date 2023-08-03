export class LoginDto {
    readonly username: string;
    readonly password: string;
}

export class GithubLoginDto {
    code: string;
}
