import { RuleConfigSeverity } from '@commitlint/types';

module.exports = {
    extends: ['@commitlint/config-conventional'], // extends can be nested
    rules: {
        'type-enum': [
            RuleConfigSeverity.Error,
            'always',
            ['feature', 'fix', 'improve', 'refactor', 'bugfix', 'hotfix'],
        ],
    },
};
