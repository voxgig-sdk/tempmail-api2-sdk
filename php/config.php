<?php
declare(strict_types=1);

// TempmailApi2 SDK configuration

class TempmailApi2Config
{
    /** @var array<string,mixed>|null */
    private static ?array $shared_config = null;

    /**
     * Return the process-wide config, built once on first use. The SDK reads
     * the config on every request and never writes to it, so one instance is
     * shared by every client rather than rebuilt per client.
     *
     * PHP arrays are copy-on-write, so callers that do mutate the result get
     * their own copy and cannot disturb the shared one.
     */
    public static function shared_config(): array
    {
        if (self::$shared_config === null) {
            self::$shared_config = self::make_config();
        }
        return self::$shared_config;
    }

    /**
     * Build a fresh, fully materialised config array. Every call rebuilds the
     * whole structure, so prefer shared_config unless you need a private copy.
     */
    public static function make_config(): array
    {
        return [
            "main" => [
                "name" => "TempmailApi2",
                "slug" => "tempmail-api2",
                "version" => "0.0.1",
                "target" => "php",
            ],
            "feature" => [
                "ratelimit" => [
          'options' => [
            'active' => false,
            'burst' => 5,
            'rate' => 5,
          ],
          'optspec' => [
            'now' => '`$FUNCTION`',
            'sleep' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
                "retry" => [
          'options' => [
            'active' => false,
            'factor' => 2,
            'maxDelay' => 2000,
            'minDelay' => 50,
            'retries' => 2,
            'statuses' => [
              408,
              425,
              429,
              500,
              502,
              503,
              504,
            ],
          ],
          'optspec' => [
            'jitter' => '`$BOOLEAN`',
            'sleep' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
                "test" => [
          'options' => [
            'active' => false,
          ],
          'optspec' => [
            'entity' => '`$MAP`',
            'net' => '`$MAP`',
          ],
          'strict' => false,
          'transport' => 'base',
        ],
                "timeout" => [
          'options' => [
            'active' => false,
            'ms' => 30000,
          ],
          'optspec' => [
            'clearTimer' => '`$FUNCTION`',
            'setTimer' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
            ],
            "options" => [
                "base" => "https://api.tempmail.lol/v2",
                "headers" => [
          'content-type' => 'application/json',
        ],
                "entity" => [
                    "domain" => [],
                    "email" => [],
                    "inbox" => [],
                ],
            ],
            "entity" => [
        'domain' => [
          'fields' => [
            [
              'name' => 'domains',
              'title' => 'Domains',
              'type' => '`$ARRAY`',
            ],
          ],
          'name' => 'domain',
          'op' => [
            'list' => [
              'input' => 'data',
              'name' => 'list',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/domains',
                  'segments' => [
                    [
                      'lit' => 'domains',
                    ],
                  ],
                  'parts' => [
                    'domains',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.domains`',
                  ],
                  'args' => [],
                  'select' => [],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'email' => [
          'fields' => [
            [
              'name' => 'attachments',
              'title' => 'Attachments',
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'body',
              'title' => 'Body',
              'type' => '`$STRING`',
              'short' => 'Email body content',
            ],
            [
              'name' => 'date',
              'title' => 'Date',
              'type' => '`$STRING`',
              'short' => 'Timestamp when email was received',
              'format' => 'date-time',
            ],
            [
              'name' => 'from',
              'title' => 'From',
              'type' => '`$STRING`',
              'short' => 'Sender email address',
              'format' => 'email',
            ],
            [
              'name' => 'html',
              'title' => 'Html',
              'type' => '`$STRING`',
              'short' => 'HTML version of email body',
            ],
            [
              'name' => 'id',
              'title' => 'Id',
              'type' => '`$STRING`',
              'short' => 'Unique identifier for the email',
            ],
            [
              'name' => 'subject',
              'title' => 'Subject',
              'type' => '`$STRING`',
              'short' => 'Email subject',
            ],
            [
              'name' => 'to',
              'title' => 'To',
              'type' => '`$STRING`',
              'short' => 'Recipient email address',
              'format' => 'email',
            ],
          ],
          'id' => [
            'field' => 'id',
            'name' => 'id',
            'parts' => [
              'token',
              'email_id',
            ],
            'sep' => '/',
          ],
          'name' => 'email',
          'op' => [
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/inbox/{token}/{emailId}',
                  'segments' => [
                    [
                      'lit' => 'inbox',
                    ],
                    [
                      'var' => 'token',
                    ],
                    [
                      'var' => 'email_id',
                    ],
                  ],
                  'parts' => [
                    'inbox',
                    '{token}',
                    '{email_id}',
                  ],
                  'rename' => [
                    'param' => [
                      'emailId' => 'email_id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'email_id',
                        'orig' => 'email_id',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                      ],
                      [
                        'name' => 'token',
                        'orig' => 'token',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'email_id',
                      'token',
                    ],
                  ],
                ],
              ],
            ],
            'remove' => [
              'input' => 'data',
              'name' => 'remove',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'DELETE',
                  'orig' => '/inbox/{token}/{emailId}',
                  'segments' => [
                    [
                      'lit' => 'inbox',
                    ],
                    [
                      'var' => 'token',
                    ],
                    [
                      'var' => 'email_id',
                    ],
                  ],
                  'parts' => [
                    'inbox',
                    '{token}',
                    '{email_id}',
                  ],
                  'rename' => [
                    'param' => [
                      'emailId' => 'email_id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'email_id',
                        'orig' => 'email_id',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                      ],
                      [
                        'name' => 'token',
                        'orig' => 'token',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'email_id',
                      'token',
                    ],
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [
              [
                '$.main.kit.entity.inbox',
              ],
            ],
          ],
        ],
        'inbox' => [
          'fields' => [
            [
              'name' => 'emails',
              'title' => 'Emails',
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'id',
              'title' => 'Id',
              'type' => '`$STRING`',
            ],
          ],
          'id' => [
            'field' => 'id',
            'name' => 'id',
          ],
          'name' => 'inbox',
          'op' => [
            'create' => [
              'input' => 'data',
              'name' => 'create',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'POST',
                  'orig' => '/inbox/create',
                  'segments' => [
                    [
                      'lit' => 'inbox',
                    ],
                    [
                      'lit' => 'create',
                    ],
                  ],
                  'parts' => [
                    'inbox',
                    'create',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                  'args' => [],
                  'select' => [
                    '$action' => 'create',
                  ],
                ],
                [
                  'kind' => 'http',
                  'method' => 'POST',
                  'orig' => '/inbox/custom',
                  'segments' => [
                    [
                      'lit' => 'inbox',
                    ],
                    [
                      'lit' => 'custom',
                    ],
                  ],
                  'parts' => [
                    'inbox',
                    'custom',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                  'args' => [],
                  'select' => [
                    '$action' => 'custom',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/inbox/{token}',
                  'segments' => [
                    [
                      'lit' => 'inbox',
                    ],
                    [
                      'var' => 'id',
                    ],
                  ],
                  'parts' => [
                    'inbox',
                    '{id}',
                  ],
                  'rename' => [
                    'param' => [
                      'token' => 'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'id',
                        'orig' => 'token',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                ],
              ],
            ],
            'remove' => [
              'input' => 'data',
              'name' => 'remove',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'DELETE',
                  'orig' => '/inbox/{token}',
                  'segments' => [
                    [
                      'lit' => 'inbox',
                    ],
                    [
                      'var' => 'id',
                    ],
                  ],
                  'parts' => [
                    'inbox',
                    '{id}',
                  ],
                  'rename' => [
                    'param' => [
                      'token' => 'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'id',
                        'orig' => 'token',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
      ],
        ];
    }


    public static function make_feature(string $name)
    {
        require_once __DIR__ . '/features.php';
        return TempmailApi2Features::make_feature($name);
    }
}
