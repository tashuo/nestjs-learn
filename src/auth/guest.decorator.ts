import { SetMetadata } from '@nestjs/common';
import { ALLOW_GUEST } from 'src/app.constant';

export const Guest = () => SetMetadata(ALLOW_GUEST, true);
