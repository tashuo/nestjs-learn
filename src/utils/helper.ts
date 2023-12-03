import { isNumber } from 'lodash';
import { LiteralObject } from '@nestjs/common';
import { ICustomAntdProPagination, ICustomCursorPaginationData, ICustomPaginationData } from 'src/interfaces/response';
import { AntdProPaginateDto, PaginateDto } from 'src/common/base/paginate.dto';
import { extname, resolve } from 'path';
import { join } from 'path';
import { outputFile } from 'fs-extra';
import { isNil, unset, omit } from 'lodash';
import { Request } from 'express';

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

export function convertToAntdProPaginationResponse<E extends LiteralObject>(
    query: AntdProPaginateDto,
    data: E[],
    total: number,
): ICustomAntdProPagination<E> {
    return {
        success: true,
        data,
        total,
        totalPages: total % query.pageSize === 0 ? Math.floor(total / query.pageSize) : Math.floor(total / query.pageSize) + 1,
        pageSize: query.pageSize,
        current: query.current,
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

/**
 * 是否是后台接口
 * @param path url path
 */
export const isRouteAdmin = (path: string): boolean => {
    return path.startsWith('/admin/');
};

/**
 * 接口是否需要rbac权限校验
 * @param path
 */
export const shouldCheckRbacAuth = (request: Request): boolean => {
    return isRouteAdmin(request.path);
};

/**
 * 填充缺失的父节点，用以兼容flatToTree
 * @param list
 */
export const autoFillMissedParents = <E extends LiteralObject>(list: E[]): E[] => {
    const parents = [];
    const node_ids = [];
    list.forEach((item: E) => {
        node_ids.push(item.id);
        if (item.parent) {
            item.parent.parent = null;
            parents.push(item.parent);
        }
    })

    parents.forEach(v => {
        if (!node_ids.includes(v.id)) {
            list.push(v);
            node_ids.push(v.id);
        }
    })

    // resort
    list.sort((a, b) => b.weight - a.weight);

    return list;
}

/**
 * 扁平树回复树形结构
 * @param trees
 * @param depth
 * @param parent
 */
export function flatToTree<E extends LiteralObject>(trees: E[], parent: E | null = null): E[] {
    const data: E[] = [];
    trees.map((item: E) => {
        if (item.parent === parent || item.parent?.id === parent) {
            data.push({
                ...omit(item, 'parent', 'depth'),
                children: flatToTree(trees, item.id),
            } as unknown as E);
        }
    });
    return data;
}

/**
 * 属性结构打平
 * @param trees
 * @param depth
 * @param parent
 */
export function treeToFlat<E extends LiteralObject>(
    trees: E[],
    depth = 0,
    parent: E | null = null,
): E[] {
    const data: Omit<E, 'children'>[] = [];
    trees.map((item: E) => {
        (item as any).depth = depth;
        (item as any).parent = parent;
        let children = [];
        if (!isNil(item.children)) {
            children = item.children;
            unset(item, 'children');
        }
        data.push(item);
        data.push(...treeToFlat(children, depth + 1, item));
    });
    return data as E[];
}
