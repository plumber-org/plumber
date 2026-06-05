import { registerAs } from '@nestjs/config';
import {
    FieldPath,
    FieldPathValue,
} from '@api/shared/utilities/helper/interface/object_field_path.interface';
import AppConfig from './app.config';
import DatabaseConfig from './database.config';
import RedisConfig from './redis.config';
import MicroserviceConfig from './microservice.config';

const config = {
    app: AppConfig,
    database: DatabaseConfig,
    redis: RedisConfig,
    microService: MicroserviceConfig,
};

const configModule = Object.entries(config).map(([name, valueFn]) => {
    return registerAs(name, valueFn);
});

export default configModule;

//------------------------------------------------------
//--------------[  Ignore below stuff  ]----------------
//------------------------------------------------------

type Config = typeof config;
type KeyOfConfig = keyof Config;

type IConfigObj = {
    [K in KeyOfConfig]: ReturnType<Config[K]>;
};

type IConfigKeys = FieldPath<IConfigObj>;

type IConfigValue<K extends IConfigKeys> = FieldPathValue<IConfigObj, K>;

declare module '@nestjs/config' {
    interface ConfigService {
        get<K extends IConfigKeys>(key: K): IConfigValue<K>;
    }
}
