(function () {
  'use strict';
  /*
   * DOMException
   */
  var DOMException, constructDOMException, createDOMException;
  DOMException = (function () {
    // Extension
    (function (child, parent) {
      function DOMException() {
        this.constructor = child;
      }
      DOMException.prototype = parent.prototype;
      child.prototype = new DOMException();
    }(DOMException, Error));

    //Prototype
    DOMException.prototype.INVALID_CHARACTER_ERR = 5;

    //Constructor
    function DOMException() {
      throw new TypeError('Illegal constructor');
    }

    return DOMException;
  }());

  createDOMException = (function (constructor) {
    DOMException.prototype = constructor.prototype;
    function DOMException(code) {
      var key;
      this.code = code;
      for (key in this) {
        if (this[key] === code) {
          this.name = key;
          this.message = key + ': DOM Exception ' + code;
        }
      }
    }
    return function (code) {return new DOMException(code); };
  }(DOMException));

  /*
   * Node
   */
  var Node, constructNode, createNode;
  Node = (function () {
    //Prototype
    Node.prototype.cloneNode = function () {};
    Node.prototype.insertBefore = function () {};
    Node.prototype.removeChild = function () {};

    //Constructor
    function Node() {
      throw new TypeError('Illegal constructor');
    }

    return Node;
  }());

  constructNode = function () {
    this.attributes = null;
    this.parentNode = null;
  }

  createNode = (function (constructor) {
    Node.prototype = constructor.prototype;
    function Node() {
      this.firstChild = null;
      this.nextSibling = null;
      this.parentElement = null;
    }
    return function () {return new Node(); };
  }(Node));

  /*
   * Element
   */
  var Element, constructElement, createElement;
  Element = (function () {
    // Extension
    (function (child, parent) {
      function Element() {
        this.constructor = child;
      }
      Element.prototype = parent.prototype;
      child.prototype = new Element();
    }(Element, Node));

    //Constructor
    function Element() {
      throw new TypeError('Illegal constructor');
    }

    return Element;
  }());

  constructElement = function(){
    constructNode.apply(this, arguments);
  }

  createElement = (function (constructor) {
    Element.prototype = constructor.prototype;
    function Element() {
    }
    return function () {return new Element(); };
  }(Element));


  /*
   * HTMLElement
   */
  var HTMLElement, attributeNameStartChar, attributeNameChar, attributeNameRegExp, attributeString, attributes, constructHTMLElement, createHTMLElement;
  HTMLElement = (function () {
    // Internals
    /* As specified at:
     * http://www.w3.org/TR/2008/REC-xml-20081126/#d0e804
     */
    var attributeNameStartChar, attributeNameChar, attributeNameRegExp, attributeString;
    attributeNameStartChar = "([:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD])";
    attributeNameChar = "(" + attributeNameStartChar + "|[\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])";
    attributeNameRegExp = new RegExp("^" + attributeNameStartChar + attributeNameChar + "*$");

    attributeString = function (string) {
      if (!attributeNameRegExp.test(string)) {throw createDOMException(5); }
      return string.toString().toLowerCase();
    };

    // Extension
    (function (child, parent) {
      function HTMLElement() {
        this.constructor = child;
      }
      HTMLElement.prototype = parent.prototype;
      child.prototype = new HTMLElement();
    }(HTMLElement, Element));

    // Prototype
    (function () {
      var attributes = {};

      HTMLElement.prototype.getAttribute = function (attribute) {
        if (typeof attribute === 'undefined') {return null; }
        return attributes[attributeString(attribute)] || null;
      };

      HTMLElement.prototype.setAttribute = function (attribute, value) {
        attributes[attributeString(attribute)] = value;
      };

      HTMLElement.prototype.querySelectorAll = function () {};
    }());

    // Constructor
    function HTMLElement() {
      throw new TypeError('Illegal constructor');
    }

    return HTMLElement;
  }());

  constructHTMLElement = function(){
    constructElement.apply(this, arguments);
  }

  createHTMLElement = (function (constructor) {
    HTMLElement.prototype = constructor.prototype;
    function HTMLElement() {
    }
    return function () {return new HTMLElement(); };
  }(HTMLElement));

  /*
   * HTMLUnknownElement
   */
  var HTMLUnknownElement, createHTMLUnknownElement;
  HTMLUnknownElement = (function () {
    // Extension
    (function (child, parent) {
      function HTMLUnknownElement() {
        this.constructor = child;
      }
      HTMLUnknownElement.prototype = parent.prototype;
      child.prototype = new HTMLUnknownElement();
    }(HTMLUnknownElement, HTMLElement));

    //Constructor
    function HTMLUnknownElement() {
      throw new TypeError('Illegal constructor');
    }

    return HTMLUnknownElement;
  }());


  createHTMLUnknownElement = (function (constructor) {
    HTMLUnknownElement.prototype = constructor.prototype;
    function HTMLUnknownElement() {
      constructHTMLElement.apply(this, arguments);
    }
    return function () {return new HTMLUnknownElement(); };
  }(HTMLUnknownElement));

  /*
   * CharacterData
   */
  var CharacterData, constructCharacterData;
  CharacterData = (function () {

    // Extension
    (function (child, parent) {
      function CharacterData() {
        this.constructor = child;
      }
      CharacterData.prototype = parent.prototype;
      child.prototype = new CharacterData();
    }(CharacterData, Node));

    // Constructor
    function CharacterData() {
      throw new TypeError('Illegal constructor');
    }

    return CharacterData;
  }());

  constructCharacterData = function () {
    constructNode.apply(this, arguments);
    this.data = '';
    Object.defineProperty(this, 'length', {
      get: (function(){
        return this.data.length;
      }).bind(this)
    })
  }

  /*
   * Text
   */
  var Text, constructText, createText;
  Text = (function () {

    // Extension
    (function (child, parent) {
      function Text() {
        this.constructor = child;
      }
      Text.prototype = parent.prototype;
      child.prototype = new Text();
    }(Text, CharacterData));

    // Constructor
    function Text() {
      throw new TypeError('Illegal constructor');
    }

    return Text;
  }());

  constructText = function (string) {
    constructCharacterData.apply(this, arguments);
    this.data = String(string);
  }

  createText = (function (constructor) {
    Text.prototype = constructor.prototype;
    function Text() {
      constructText.apply(this, arguments)
    }
    return function (string) {return new Text(string); };
  }(Text));

  /*
   * Document
   */
  var Document;
  Document = (function () {

    // Extension
    (function (child, parent) {
      function Document() {
        this.constructor = child;
      }
      Document.prototype = parent.prototype;
      child.prototype = new Document();
    }(Document, Node));

    // Constructor
    function Document() {
      throw new TypeError('Illegal constructor');
    }

    return Document;
  }());

  /*
   * HTMLDocument
   */
  var HTMLDocument, constructHTMLDocument, createHTMLDocument;
  HTMLDocument = (function () {

    // Extension
    (function (child, parent) {
      function HTMLDocument() {
        this.constructor = child;
      }
      HTMLDocument.prototype = parent.prototype;
      child.prototype = new HTMLDocument();
    }(HTMLDocument, Document));

    // Prototype
    HTMLDocument.prototype.createTextNode = createText;
    HTMLDocument.prototype.createElement = createHTMLUnknownElement;

    // Constructor
    function HTMLDocument() {
      throw new TypeError('Illegal constructor');
    }

    return HTMLDocument;
  }());

  createHTMLDocument = (function (constructor) {
    HTMLDocument.prototype = constructor.prototype;
    function HTMLDocument() {
    }
    return function () {return new HTMLDocument(); };
  }(HTMLDocument));

  /*
   * Window
   */
  var Window, constructWindow, createWindow;
  Window = (function () {
    // Constructor
    function Window() {
      throw new TypeError('Illegal constructor');
    }

    return Window;
  }());

  createWindow = (function (constructor) {
    Window.prototype = constructor.prototype;
    function Window() {
      this.Node = Node;
      this.Element = Element;
      this.HTMLElement = HTMLElement;
      this.CharacterData = CharacterData;
      this.Text = Text;
      this.Document = Document;
      this.HTMLDocument = HTMLDocument;
      this.document = createHTMLDocument();
    }
    return function () {return new Window(); };
  }(Window));

  exports.window = createWindow();
}());