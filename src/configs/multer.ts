import { randomUUID } from 'crypto';
import { extname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage, Options as MulterOptions } from 'multer';

export const publicFolder = resolve(__dirname, '..', '..', 'upload');

export const multerConfig = {
  dest: './upload',
};

export const multerOptions: MulterOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      cb(null, uploadPath);
    },
    filename: (
      req: any,
      file: Express.Multer.File,
      cb: (error: Error, filename: string) => void,
    ) => {
      cb(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  }),
};
