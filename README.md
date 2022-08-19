# OwnerRez Zapier Integration

## Testing

The [Zapier Platform CLI](https://github.com/zapier/zapier-platform/blob/master/packages/cli/docs/cli.md) should be used to validate and test all changes.

### Writing Tests

Tests are written in [mocha.js](https://mochajs.org/) with [should.js](https://shouldjs.github.io/) for assertions.

Unit tests should utilize [nock.js](https://github.com/nock/nock/blob/main/README.md) to mock API requests. See working tests as examples. 

Integration tests should only be included if basic auth environment variables are present (e.g. `if (process.env.AUTH_USERNAME)`).

### Running Tests

To run all tests, use:
```powershell
zapier test --skip-validate
```

Or use mocha directly to run a subset of tests:
```powershell
mocha --recursive -g "<filter tests>"
```

If using powershell, you can set environment variables as:
```powershell
$env:AUTH_USERNAME='your@user.name'; $env:AUTH_PASSWORD='pt_yourpersonaltoken';
```
