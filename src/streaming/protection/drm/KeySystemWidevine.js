/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Google Widevine DRM
 *
 * @class
 * @implements MediaPlayer.dependencies.protection.KeySystem
 */

import CommonEncryption from '../CommonEncryption';
import FactoryMaker from '../../../core/FactoryMaker';

const uuid = 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed';
const systemString = 'com.widevine.alpha';
const schemeIdURI = 'urn:uuid:' + uuid;

function KeySystemWidevine() {

    let instance;
    let messageFormat = 'utf8';

    function getInitData(cp) {
        return CommonEncryption.parseInitDataFromContentProtection(cp);
    }

    function getRequestHeadersFromMessage(/*message*/) {
        return null;
    }

    function getLicenseRequestFromMessage(message) {
        var dataview = messageFormat === 'utf16' ? new Uint16Array(message) : new Uint8Array(message);

        var b64msg = String.fromCharCode.apply(null, dataview);
        console.log('CCAD: length of b64msg ' + b64msg.length);
        var msg = window.atob(b64msg);
        var byteNumbers = new Array(msg.length);
        for (var i = 0; i < msg.length; i++) {
            byteNumbers[i] = msg.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        return byteArray;
    }

    function getLicenseServerURLFromInitData(/*initData*/) {
        return null;
    }

    /**
     * It seems that some PlayReady implementations return their XML-based CDM
     * messages using UTF16, while others return them as UTF8.  Use this function
     * to modify the message format to expect when parsing CDM messages.
     *
     * @param {string} format the expected message format.  Either "utf8" or "utf16".
     * @throws {Error} Specified message format is not one of "utf8" or "utf16"
     */
    function setPlayReadyMessageFormat(format) {
        if (format !== 'utf8' && format !== 'utf16') {
            throw new Error('Illegal PlayReady message format! -- ' + format);
        }
        messageFormat = format;
    }

    instance = {
        uuid: uuid,
        schemeIdURI: schemeIdURI,
        systemString: systemString,
        getInitData: getInitData,
        getRequestHeadersFromMessage: getRequestHeadersFromMessage,
        getLicenseRequestFromMessage: getLicenseRequestFromMessage,
        getLicenseServerURLFromInitData: getLicenseServerURLFromInitData,
        setPlayReadyMessageFormat: setPlayReadyMessageFormat
    };

    return instance;
}

KeySystemWidevine.__dashjs_factory_name = 'KeySystemWidevine';
export default FactoryMaker.getSingletonFactory(KeySystemWidevine);
