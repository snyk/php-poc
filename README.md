![logo](https://res.cloudinary.com/snyk/image/upload/v1468845259/logo/snyk-dog.svg)
## Snyk: php POC
***

This POC app will print a JSON formatted dependencies tree for a composer.json file. 
### Usage
##### install php & composer
##### prepare target app: 

##### run poc:
```
cd <target app folder> && php composer.phar install
cd <poc folder> && node app.js <path-to-target-app>
```
Example: 
``` 
node app.js '/Users/me/workspace/snyk/php-composer/Faker'  
```
### Example 
For the following composer.json:
```
{
    "require": {
        "psy/psysh":"v0.8.4",
        "guzzlehttp/promises": "^1.0"
    }
}
```

This will be the output:
```
{
  "name": "app",
  "version": "0.0.0",
  "dependencies": [
    {
      "name": "guzzlehttp/promises",
      "version": "v1.3.1",
      "dependencies": [],
      "from": [
        "guzzlehttp/promises@v1.3.1",
        "app@0.0.0"
      ]
    },
    {
      "name": "psy/psysh",
      "version": "v0.8.4",
      "dependencies": [],
      "from": [
        "psy/psysh@v0.8.4",
        "app@0.0.0"
      ]
    },
    {
      "name": "symfony/console",
      "version": "v3.2.8",
      "dependencies": [
        {
          "name": "symfony/debug",
          "version": "v3.2.8",
          "dependencies": [
            {
              "name": "psr/log",
              "version": "1.0.2",
              "dependencies": [],
              "from": [
                "psr/log@1.0.2",
                "symfony/debug@v3.2.8",
                "symfony/console@v3.2.8",
                "app@0.0.0"
              ]
            }
          ],
          "from": [
            "symfony/debug@v3.2.8",
            "symfony/console@v3.2.8",
            "app@0.0.0"
          ]
        },
        {
          "name": "symfony/polyfill-mbstring",
          "version": "v1.3.0",
          "dependencies": [],
          "from": [
            "symfony/polyfill-mbstring@v1.3.0",
            "symfony/console@v3.2.8",
            "app@0.0.0"
          ]
        }
      ],
      "from": [
        "symfony/console@v3.2.8",
        "app@0.0.0"
      ]
    },
    {
      "name": "symfony/var-dumper",
      "version": "v3.2.8",
      "dependencies": [
        {
          "name": "symfony/polyfill-mbstring",
          "version": "v1.3.0",
          "dependencies": [],
          "from": [
            "symfony/polyfill-mbstring@v1.3.0",
            "symfony/var-dumper@v3.2.8",
            "app@0.0.0"
          ]
        }
      ],
      "from": [
        "symfony/var-dumper@v3.2.8",
        "app@0.0.0"
      ]
    }
  ],
  "from": [
    "app@0.0.0"
  ]
}
```
