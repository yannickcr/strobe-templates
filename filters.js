/**
 * Filters for strobe template
 * (the syntax for filters options is very limited for now, it will evolve in a near future)
 * 
 * To add your owns filters:
 *
 *  templates.Filters.myFilter = function(string, options){
 *    [...]
 *    return string;
 *  }
 * 
 * and to use it in your templates:
 * 
 * {{ myVariable|myFilter:option1,option2,option3 }}
 * 
 * See bellow for some filters examples
 * 
 */
 
/* 
 * Defaults filters
 *  
 * All this filters are from [Mootools](http://www.mootools.net)
 * See [Types.String](http://www.mootools.net/docs/core/Types/String) and [Types.String.Extras](http://www.mootools.net/docs/more/Types/String.Extras) for more informations
 * 
 * Authors:
 * - Aaron Newton
 * - Guillermo Rauch
 * - Christopher Pitt
 * 
 */

var special = {
  'a': /[àáâãäåăą]/g,
  'A': /[ÀÁÂÃÄÅĂĄ]/g,
  'c': /[ćčç]/g,
  'C': /[ĆČÇ]/g,
  'd': /[ďđ]/g,
  'D': /[ĎÐ]/g,
  'e': /[èéêëěę]/g,
  'E': /[ÈÉÊËĚĘ]/g,
  'g': /[ğ]/g,
  'G': /[Ğ]/g,
  'i': /[ìíîï]/g,
  'I': /[ÌÍÎÏ]/g,
  'l': /[ĺľł]/g,
  'L': /[ĹĽŁ]/g,
  'n': /[ñňń]/g,
  'N': /[ÑŇŃ]/g,
  'o': /[òóôõöøő]/g,
  'O': /[ÒÓÔÕÖØ]/g,
  'r': /[řŕ]/g,
  'R': /[ŘŔ]/g,
  's': /[ššş]/g,
  'S': /[ŠŞŚ]/g,
  't': /[ťţ]/g,
  'T': /[ŤŢ]/g,
  'ue': /[ü]/g,
  'UE': /[Ü]/g,
  'u': /[ùúûůµ]/g,
  'U': /[ÙÚÛŮ]/g,
  'y': /[ÿý]/g,
  'Y': /[ŸÝ]/g,
  'z': /[žźż]/g,
  'Z': /[ŽŹŻ]/g,
  'th': /[þ]/g,
  'TH': /[Þ]/g,
  'dh': /[ð]/g,
  'DH': /[Ð]/g,
  'ss': /[ß]/g,
  'oe': /[œ]/g,
  'OE': /[Œ]/g,
  'ae': /[æ]/g,
  'AE': /[Æ]/g
},

tidy = {
  ' ': /[\xa0\u2002\u2003\u2009]/g,
  '*': /[\xb7]/g,
  '\'': /[\u2018\u2019]/g,
  '"': /[\u201c\u201d]/g,
  '...': /[\u2026]/g,
  '-': /[\u2013]/g,
  '&raquo;': /[\uFFFD]/g
};

var walk = function(string, replacements){
  var result = string;
  for (key in replacements) result = result.replace(replacements[key], key);
  return result;
};

var getRegexForTag = function(tag, contents){
  tag = tag || '';
  var regstr = contents ? "<" + tag + "(?!\\w)[^>]*>([\\s\\S]*?)<\/" + tag + "(?!\\w)>" : "<\/?" + tag + "([^>]+)?>";
  reg = new RegExp(regstr, "gi");
  return reg;
};

var Filters = {

  trim: function(string){
    return string.replace(/^\s+|\s+$/g, '');
  },
  
  camelCase: function(string){
    return string.replace(/-\D/g, function(match){
      return match.charAt(1).toUpperCase();
    });
  },
  
  hyphenate: function(string){
    return string.replace(/[A-Z]/g, function(match){
      return ('-' + match.charAt(0).toLowerCase());
    });
  },
  
  capitalize: function(string){
    return string.replace(/\b[a-z]/g, function(match){
      return match.toUpperCase();
    });
  },
  
  standardize: function(string){
    return walk(string, special);
  },
  
  getTags: function(string, options){
    return string.match(getRegexForTag(options[0], options[1])) || [];
  },
  
  stripTags: function(string, options){
    return string.replace(getRegexForTag(options[0], options[1]), '');
  },
  
  tidy: function(string){
    return walk(string, tidy);
  },
  
  truncate: function(string, options){
    if (options[1] == null && options.length == 1) options[1] = '…';
    if (string.length > options[0]){
      string = string.substring(0, options[0]);
      if (options[3]){
        var index = string.lastIndexOf(options[3]);
        if (index != -1) string = string.substr(0, index);
      }
      if (options[1]) string += options[1];
    }
    return string;
  },
  
  /*
   * Slugify, by [Stian Didriksen](https://github.com/stipsan/String.Slugify.js)
   */
  slugify: function(string, options){
    if (!options[0]) options[0] = '-';
    var str = this.standardize(this.tidy(string)).replace(/[\s\.]+/g,options[0]).toLowerCase().replace(new RegExp('[^a-z0-9'+options[0]+']','g'),options[0]).replace(new RegExp(options[0]+'+','g'),options[0]);
    if (str.charAt(str.length-1) == options[0]) str = str.substring(0, str.length-1);
    return str;
  }
}

exports.Filters = Filters;