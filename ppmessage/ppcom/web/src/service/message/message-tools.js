((function(Service) {

    var $messageToolsModule = (function Tools() {

        var _toType; // message send to_type detect by different policy

        function encodeTextWithUtf8(s) {
            return unescape(encodeURIComponent(s));
        }

        function isTextLengthLargerThan128(text) {
            return encodeTextWithUtf8(text).length > Service.Constants.MESSAGE.TEXT_MAX_LEN;
        }

        function isMessageTextOverflow(msg) {
            return isTextLengthLargerThan128(msg.message.text.body);
        }

        // Currently, we have the following message types:
        //
        // -TEXT
        // -EMOJI
        // -IMAGE
        // -FILE
        // -AUDIO
        //
        // -WELCOME
        // -TIMESTAMP
        //
        // `WELCOME` and `TIMESTAMP` was generated by ourself to faciliate our programming, not a real message
        function isMessage(msg) {
            if (!msg || !msg.messageType) return false; // illegal message

            var TYPE = Service.PPMessage.TYPE;
            return $.inArray(msg.messageType.toUpperCase(), [
                TYPE.TEXT,
                TYPE.EMOJI,
                TYPE.IMAGE,
                TYPE.FILE,
                TYPE.AUDIO
            ]) !== -1;
        }

        // detect to_type
        function toType() {

            if (!_toType) {
                
                switch (Service.$app.policy()) {
                    
                case Service.$app.POLICY.ALL:
                    _toType = Service.PPMessage.TO_TYPE.AP;
                    break;

                case Service.$app.POLICY.GROUP:
                    _toType = Service.PPMessage.TO_TYPE.OG;
                    break;

                default:
                    _toType = Service.PPMessage.TO_TYPE.AP;
                    break;
                }
                
            }

            return _toType;
        }

        return {
            isTextLengthLargerThan128: isTextLengthLargerThan128,
            isMessageTextOverflow: isMessageTextOverflow,

            isMessage: isMessage,

            toType: toType
        }
        
    })();

    Service.$messageToolsModule = $messageToolsModule;
    
})(Service));
