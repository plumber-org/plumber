import { Injectable, Logger } from '@nestjs/common';
import { IOAuthProfile, IOAuthTokenSet } from './oauth.types';

/**
 * OAuth provider integration (Google, GitHub, etc.).
 * Wire passport strategies or provider SDKs here.
 */
@Injectable()
export class OAuthService {
    private readonly logger = new Logger(OAuthService.name);

    async exchangeCodeForTokens(_provider: string, _code: string): Promise<IOAuthTokenSet | null> {
        this.logger.debug('OAuth token exchange not configured');
        return null;
    }

    async fetchProfile(_provider: string, _accessToken: string): Promise<IOAuthProfile | null> {
        this.logger.debug('OAuth profile fetch not configured');
        return null;
    }
}
