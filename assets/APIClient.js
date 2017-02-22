(function (root, target) {
  var DOWNLOAD_FILE_REQUEST = 'downloadFileRequest';
  var DOWNLOAD_FILE_RESPONSE = 'downloadFileResponse';
  // TODO might be useful for handshake sequence
  var SESSION_START_REQUEST = 'sessionStartRequest';
  var SESSION_START_RESPONSE = 'sessionStartResponse';
  var SESSION_CLOSE_REQUEST = 'sessionCloseRequest';


  var mapping = {};
  mapping[SESSION_START_RESPONSE] = '__sessionStart';
  mapping[DOWNLOAD_FILE_RESPONSE] = 'onDownloadFile';

  function APIClient(target) {

    var _initInterval = 0;
    var _initData = undefined;
    var _initialized = false;

    function sendMessage(type, data) {
      return target.postMessage(JSON.stringify({
        type: type,
        data: data
      }), '*');
    }

    function receiveMessage(event) {
      var message = JSON.parse(event.data);
      var listenerName = mapping[message.type];
      if (listenerName && typeof(this[listenerName]) === 'function') {
        this[listenerName](message.data);
      }
    }

    /**
     * @param data
     * @private
     */
    this.__sessionStart = function (data) {
      _initInterval && clearInterval(_initInterval);
      _initialized = true;
      _initData = data;
      _initInterval = 0;
      if (typeof(this.onSessionStart) === 'function') {
        this.onSessionStart(data);
      }
    };

    target.addEventListener('message', receiveMessage.bind(this));

    // Tell App that WebView is ready
    this.initialize = function () {
      if (_initialized) {
        this.__sessionStart(_initData);
      } else {
        _initInterval = setInterval(sendMessage, 500, SESSION_START_REQUEST);
      }
    };

    // Tell App it can "go Back" or continue
    this.close = function () {
      sendMessage(SESSION_CLOSE_REQUEST);
    };

    // Tell App it should download this file
    this.downloadFile = function (url, fileType) {
      sendMessage(DOWNLOAD_FILE_REQUEST, {
        url: url,
        fileType: fileType
      });
    };

    // Event listeners for
    this.onSessionStart = null; // communication with App established
    this.onDownloadFile = null; // file downloaded

    // immediately tell App that WebView is ready to accept commands
    this.initialize();
  }

  root.apiClient = new APIClient(target);
})(window, {
  postMessage: function (message, target) {
    return window.postMessage(message, target);
  },
  addEventListener: document.addEventListener.bind(document)
});
