import { isNumber } from 'lodash';
import { LiteralObject } from '@nestjs/common';
import { ICustomCursorPaginationData, ICustomPaginationData } from 'src/interfaces/response';
import { PaginateDto } from 'src/common/base/paginate.dto';
import { extname, resolve } from 'path';
import { join } from 'path';
import { outputFile } from 'fs-extra';
import { isNil } from 'lodash';

// uniqid from php
export const uniqid = (prefix = '', random?: boolean) => {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, '').padEnd(14, '0');
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ''}`;
};

export const getRandomNumber = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

export const convertToFriendlyTime = (date: number | Date): string => {
    const now = new Date().getTime();
    const originTimestamp = isNumber(date) ? (date as number) : (date as Date).getTime();
    const diffTime = (now - originTimestamp) / 1000;
    switch (true) {
        case diffTime < 60:
            return '刚刚';
        case diffTime < 60 * 60:
            return `${Math.floor(diffTime / 60)}分钟前`;
        case diffTime < 60 * 60 * 24:
            return `${Math.floor(diffTime / 60 / 60)}小时前`;
        case diffTime < 60 * 60 * 24 * 7:
            return `${Math.floor(diffTime / 60 / 60 / 24)}天前`;
        default:
            const date = new Date(originTimestamp);
            return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    }
};

export function convertToPaginationResponse<E extends LiteralObject>(
    query: PaginateDto,
    items: E[],
    total: number,
): ICustomPaginationData<E> {
    const page = parseInt(query.page as unknown as string);
    const limit = parseInt(query.limit as unknown as string);
    return {
        items,
        meta: {
            total,
            totalPages:
                total % limit === 0 ? Math.floor(total / limit) : Math.floor(total / limit) + 1,
            limit: limit,
            nextPage: items.length >= limit ? page + 1 : 0,
            page: page,
        },
    };
}

export function convertToCursorPaginationResponse<E extends LiteralObject>(
    query: PaginateDto,
    items: E[],
): ICustomCursorPaginationData<E> {
    const limit = parseInt(query.limit as unknown as string);
    return {
        items,
        meta: {
            cursor: query.cursor || 0,
            limit,
            hasMore: items.length === limit,
        },
    };
}

export const getLocalFileDomain = (): string => {
    return process.env.APP_URL || '127.0.0.1';
};

export const getUploadDir = (): string => {
    const dir = process.env.FILE_UPLOAD_DIR;
    return isNil(dir)
        ? resolve(__dirname, '../../upload')
        : dir.startsWith('/')
        ? dir
        : resolve(__dirname, `../../${dir}`);
};

export const generateClientFileName = (originFileName: string): string => {
    return `${uniqid()}${extname(originFileName)}`;
};

export const generateClientUploadPath = (
    userId: number,
    prefix = '',
    useDateAchieve = true,
): string => {
    let path = join(getUploadDir(), userId.toString(), prefix);
    if (useDateAchieve) {
        const date = new Date();
        path = join(
            path,
            date.getFullYear().toString(),
            (date.getMonth() + 1).toString(),
            date.getDate().toString(),
        );
    }
    return path;
};

export const uploadClientFile = async (
    userId: number,
    file: Express.Multer.File,
    prefix = '',
    useDateAchieve = true,
): Promise<string> => {
    const path = generateClientUploadPath(userId, prefix, useDateAchieve);
    const filename = generateClientFileName(file.originalname);
    const filePath = join(path, filename);
    await outputFile(filePath, file.buffer, (err) => {
        err && console.log('upload error');
    });
    return filePath.replace(getUploadDir(), '');
};

export const uploadClientFiles = async (
    userId: number,
    files: Express.Multer.File[],
    prefix = '',
    useDateAchieve = true,
): Promise<string[]> => {
    return Promise.all(
        files.map(async (v) => await uploadClientFile(userId, v, prefix, useDateAchieve)),
    );
};
