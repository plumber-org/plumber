import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import Configs from '@api/shared/infrastructure/config';

/** apps/api — env files live next to this package's package.json */
const apiRoot = join(__dirname, '../..');
const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFilePath = join(apiRoot, `.env.${nodeEnv}`);

export default (() => {
    return ConfigModule.forRoot({
        load: Configs,
        isGlobal: true,
        cache: true,
        ignoreEnvFile: false,
        envFilePath: [envFilePath],
    });
})();
