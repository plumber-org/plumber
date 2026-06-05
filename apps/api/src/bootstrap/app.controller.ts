import { Controller, Get } from '@nestjs/common';
@Controller('health-check')
export class AppController {
    @Get()
    sendResponse() {
        console.log('Service running successfully ...');
        return 'Service running successfully ...';
    }
}
