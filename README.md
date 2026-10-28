# OwnerRez Zapier Integration

## Testing

The [Zapier Platform CLI](https://github.com/zapier/zapier-platform/blob/master/packages/cli/docs/cli.md) should be used to validate and test all changes.

### Writing Tests

Tests are written in [mocha.js](https://mochajs.org/) with [should.js](https://shouldjs.github.io/) for assertions.

Unit tests should utilize [nock.js](https://github.com/nock/nock/blob/main/README.md) to mock API requests. See working tests as examples. 

Integration tests should only be included if basic auth environment variables are present (e.g. `if (process.env.AUTH_USERNAME)`).

### Running Tests

Install the CLI with `npm i -g zapier-platform-cli` (or prefix commands with `npx zapier-platform-cli` instead of `zapier`), then run `zapier login` once.

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

- `AUTH_PASSWORD` is a Personal Access Token created at [Developer/API Settings](https://app.dev.ownerrez.com/settings/api) on the environment `API_ROOT` points to. `AUTH_USERNAME` is the email of the user who owns it. A token from another environment returns 401 `invalid_token`.
- Tests that use `z.cursor` (e.g. `field_definition_lookup`) call Zapier's RPC API and need `ZAPIER_DEPLOY_KEY`. `zapier test` supplies it from your `zapier login` credentials; plain `mocha` does not.

## Publishing

`package.json` `version` is the Zapier app version. `zapier push` with the version that is already promoted overwrites the live app for every user, so always bump first.

1. Bump the version: `npm version <x.y.z> --no-git-tag-version`.
2. Add a `## <x.y.z>` entry to [CHANGELOG.md](CHANGELOG.md) describing user-facing changes. `zapier promote` refuses to run without one.
3. `zapier push`. The version uploads as a draft with no users; `zapier versions` shows its state.
4. Test the draft in the Zapier editor. Draft versions are visible only to the integration's team members; pick the version in each OwnerRez step's version selector. Use the Zapier team account whose connection points at an OwnerRez dev user, and check:
   - Connecting an account (OAuth).
   - Each trigger: "Test trigger" loads samples, and with the Zap turned on, a matching change in OwnerRez runs the Zap.
   - Each action: dynamic dropdowns load, and the action changes the record. Tag and custom-field actions change nothing on a second run.
   - Each search, with a prefixed ID (e.g. `ORB1234`).
5. Merge the PR.
6. `zapier promote <x.y.z>`. New users get this version. Promoting a version without breaking changes also starts a migration of all Zaps from the previously promoted version; `zapier jobs` shows its progress, and `zapier migrate` fails until it completes.
7. Monitor with `zapier logs --type=http --status=error` and the Monitoring page in the Zapier developer platform.
8. Roll back with `zapier migrate <x.y.z> <previous> 100`.

`promote` and `migrate` ask for confirmation. In a non-interactive shell (CI, agents) add `--yes`, or the prompt fails with `ERR_USE_AFTER_CLOSE`.

## Licensing

This integration has been released as a public repository under the [AGPLv3 License](LICENSE) for the express purpose of encouraging user contributions to the enhancement of this integration. This License does not grant any rights in the trademarks, service marks, or logos of any Contributor. 

OwnerRez and the OwnerRez logo are [trademarks of OwnerRez](https://www.ownerrez.com/trademark) and are protected as such. These trademarks may not be used in connection with any product or service that is not affiliated with OwnerRez, in any manner that is likely to cause confusion among OwnerRez users, or in any manner that disparages or discredits OwnerRez.
