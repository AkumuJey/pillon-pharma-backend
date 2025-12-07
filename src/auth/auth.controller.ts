import { All, Controller, Req, Res, Next } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @All('*path') // ← Changed from '*' to '*path'
  async handleAuth(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);

      const request = new Request(url, {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
        body:
          req.method !== 'GET' && req.method !== 'HEAD'
            ? JSON.stringify(req.body)
            : undefined,
      });

      const response = await this.authService.auth.handler(request);

      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      const text = await response.text();
      res.send(text);
    } catch (error) {
      next(error);
    }
  }
}
