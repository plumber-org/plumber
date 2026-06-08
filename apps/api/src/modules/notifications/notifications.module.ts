import { Module } from '@nestjs/common';
import { NOTIFICATIONS_FACADE, NotificationsFacade } from './public';

@Module({
    providers: [{ provide: NOTIFICATIONS_FACADE, useClass: NotificationsFacade }],
    exports: [NOTIFICATIONS_FACADE],
})
export class NotificationsModule {}
