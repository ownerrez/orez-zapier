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

Set environment variables in the `.env` file. This file should never be committed to git. These variables are not deployed to Zapier.
```
AUTH_USERNAME=your@user.name
AUTH_PASSWORD=pt_yourpersonaltoken
API_ROOT=https://api.dev.ownerrez.com
APP_ROOT=https://app.dev.ownerrez.com

# Tell node not to validate personally signed cert
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Licensing

This integration has been released as a public repository under the [AGPLv3 License](LICENSE) for the express purpose of encouraging user contributions to the enhancement of this integration. This License does not grant any rights in the trademarks, service marks, or logos of any Contributor. 

OwnerRez and the OwnerRez logo are [trademarks of OwnerRez](https://www.ownerrez.com/trademark) and are protected as such. These trademarks may not be used in connection with any product or service that is not affiliated with OwnerRez, in any manner that is likely to cause confusion among OwnerRez users, or in any manner that disparages or discredits OwnerRez.
