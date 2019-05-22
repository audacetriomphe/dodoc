const cors = require('cors');

const file = require('./file');

module.exports = (function() {
  const API = {
    init: app => {
      return _initRemoteApi(app);
    }
  };

  function _initRemoteApi(app) {
    dev.logfunction('REMOTE_API — _initRemoteApi');

    // list all of type (projects, publications, etc.)
    if (!global.settings.api.enabled) {
      return false;
    }

    dev.logverbose('REMOTE_API — _initRemoteApi : is enabled');

    app.options('/api/:type/:slug?', cors());
    app.get(
      '/api/:type/:slug?',
      [cors(_corsCheck), _sessionPasswordCheck],
      _sendResources
    );
  }

  function _corsCheck(req, callback) {
    dev.logfunction('REMOTE_API — _corsCheck');
    var corsOptions;
    if (global.settings.api.allow_all_domains) {
      dev.logverbose('REMOTE_API — _corsCheck : allowed for all domains');
      corsOptions = { origin: true };
    } else {
      dev.logverbose(
        'REMOTE_API — _initRemoteApi : allowed for specific domains'
      );

      if (
        global.settings.api.domains_whitelist.indexOf(req.header('Origin')) !==
        -1
      ) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
      } else {
        corsOptions = { origin: false }; // disable CORS for this request
      }
    }

    callback(null, corsOptions);
  }

  function _sessionPasswordCheck(req, res, next) {
    dev.logfunction('REMOTE_API — _sessionPasswordCheck');

    if (global.hasOwnProperty('session_password')) {
      if (global.session_password !== '') {
        if (!req.headers.hasOwnProperty('session_password')) {
          dev.error('REMOTE_API — _sessionPasswordCheck : no password sent');
          return res
            .status(500)
            .send(
              'No password sent while this do•doc uses a session_password, please add it'
            );
        }

        // if has pass, check for request password
        function hashCode(s) {
          return s.split('').reduce(function(a, b) {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
          }, 0);
        }

        const request_password = new Buffer(
          req.headers.session_password,
          'base64'
        ).toString('binary');

        if (hashCode(request_password) !== global.session_password) {
          dev.error('REMOTE_API — _sessionPasswordCheck : wrong password');
          return res.status(500).send('Wrong password sent!');
        }
      }
    }

    dev.logverbose(
      'REMOTE_API — _sessionPasswordCheck : password checks passed'
    );
    next();
  }

  function _sendResources(req, res, next) {
    dev.logfunction('REMOTE_API — _sendResources');

    let type = req.params.type;
    let slugFolderName = req.params.slug;

    const hrstart = process.hrtime();
    _getContent({ type, slugFolderName })
      .then(d => {
        dev.log('Returned api request successfully');
        let hrend = process.hrtime(hrstart);
        dev.performance(
          `PERFORMANCE — _getContent : ${hrend[0]}s ${hrend[1] / 1000000}ms`
        );
        res.json(d);
      })
      .catch(err => {
        dev.error('Failed to get expected content');
        res.status(404).send('Error parsing request: ' + err);
      });
  }

  function _getContent({ type, slugFolderName }) {
    return new Promise(function(resolve, reject) {
      dev.logfunction(
        `REMOTE_API - _getContent for type = ${type}, slugFolderName = ${slugFolderName}`
      );

      let foldersData;

      file
        .getFolder({ type, slugFolderName })
        .then(_foldersData => {
          if (_foldersData === undefined) {
            res.json(foldersData);
            return reject('No folder found with name ' + slugFolderName);
          }
          foldersData = _foldersData;

          if (!slugFolderName) {
            return resolve(foldersData);
          } else {
            return file.getMediaMetaNames({
              type,
              slugFolderName
            });
          }
        })
        .then(list_metaFileName => {
          let medias_list = list_metaFileName.map(_metaFileName => {
            return {
              slugFolderName,
              metaFileName: _metaFileName
            };
          });
          return file.readMediaList({ type, medias_list });
        })
        .then(folders_and_medias => {
          if (
            folders_and_medias !== undefined &&
            Object.keys(folders_and_medias).length
          ) {
            foldersData[slugFolderName].medias =
              folders_and_medias[slugFolderName].medias;
          }

          // TODO : filter with password if folder has password
          let filtered_folders_and_medias = foldersData;

          return resolve(filtered_folders_and_medias);
        })
        .catch(err => reject(err));
    });
  }

  return API;
})();
