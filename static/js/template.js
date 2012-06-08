define(['order!jquery', 'order!libs/jquery/jquery.tmpl'], function($) {

    var TEMPLATES = {};

    var Templates = {
        addTemplate: function(tmplName, tmplText) {
            if (!$.template[tmplName]) {
                try {
                    $.template(tmplName, tmplText);
                } catch (e) {
                    console.log('Error compiling: ', tmplName, ': ', e);
                    throw e;
                }
            }
        },

        render: function(tmplName, context) {
            if ($.template[tmplName]) {
                return $.tmpl(tmplName, context);
            }
            return 'Missing template: ' + tmplName;
        }
    };
    return Templates;
});
