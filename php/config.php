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
                "test" => [
          'options' => [
            'active' => false,
          ],
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
                  'args' => [],
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/domains',
                  'parts' => [
                    'domains',
                  ],
                  'select' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.domains`',
                  ],
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
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'body',
              'short' => 'Email body content',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'date',
              'short' => 'Timestamp when email was received',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'from',
              'short' => 'Sender email address',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'html',
              'short' => 'HTML version of email body',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'id',
              'short' => 'Unique identifier for the email',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'subject',
              'short' => 'Email subject',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'to',
              'short' => 'Recipient email address',
              'type' => '`$STRING`',
            ],
          ],
          'name' => 'email',
          'op' => [
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'email_id',
                        'orig' => 'email_id',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                      [
                        'kind' => 'param',
                        'name' => 'token',
                        'orig' => 'token',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/inbox/{token}/{emailId}',
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
                  'select' => [
                    'exist' => [
                      'email_id',
                      'token',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
            'remove' => [
              'input' => 'data',
              'name' => 'remove',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'email_id',
                        'orig' => 'email_id',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                      [
                        'kind' => 'param',
                        'name' => 'token',
                        'orig' => 'token',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'DELETE',
                  'orig' => '/inbox/{token}/{emailId}',
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
                  'select' => [
                    'exist' => [
                      'email_id',
                      'token',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [
              [
                'inbox',
              ],
            ],
          ],
        ],
        'inbox' => [
          'fields' => [
            [
              'name' => 'domain',
              'short' => 'Domain for the email address (optional)',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'email',
              'short' => 'The generated temporary email address',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'emails',
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'token',
              'short' => 'Authentication token for accessing the inbox',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'username',
              'req' => true,
              'short' => 'Desired username for the email address',
              'type' => '`$STRING`',
            ],
          ],
          'name' => 'inbox',
          'op' => [
            'create' => [
              'input' => 'data',
              'name' => 'create',
              'points' => [
                [
                  'args' => [],
                  'kind' => 'http',
                  'method' => 'POST',
                  'orig' => '/inbox/create',
                  'parts' => [
                    'inbox',
                    'create',
                  ],
                  'select' => [
                    '$action' => 'create',
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
                [
                  'args' => [],
                  'kind' => 'http',
                  'method' => 'POST',
                  'orig' => '/inbox/custom',
                  'parts' => [
                    'inbox',
                    'custom',
                  ],
                  'select' => [
                    '$action' => 'custom',
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'id',
                        'orig' => 'token',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/inbox/{token}',
                  'parts' => [
                    'inbox',
                    '{id}',
                  ],
                  'rename' => [
                    'param' => [
                      'token' => 'id',
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
            'remove' => [
              'input' => 'data',
              'name' => 'remove',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'id',
                        'orig' => 'token',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'DELETE',
                  'orig' => '/inbox/{token}',
                  'parts' => [
                    'inbox',
                    '{id}',
                  ],
                  'rename' => [
                    'param' => [
                      'token' => 'id',
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
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
