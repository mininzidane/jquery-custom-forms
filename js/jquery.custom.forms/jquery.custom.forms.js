/**
 * Created by JetBrains PhpStorm.
 * User: MinIN
 * Date: 12.10.11
 * Time: 21:41
 */


(function($) {
    $.fn.customize = function(opts) {
        var defaults = {
            classHolder: "select-holder",
            classHolderOpen: "select-holder-open",
            classToggle: "select-toggle",
            classToggleOpen: "select-toggle-open",
            classSelected: "select-selected",
            classOptions: "select-options",
            classCheckboxOn: "checkbox-on",
            classRadioOn: "radio-on",
            classSelectWrap: "customized-select",
            classCheckboxWrap: "customized-checkbox",
            classRadioWrap: "customized-radio",
            initCallback: function(elem, clone) {
            },
            changeStatusCallback: function(elem, clone, status) {
            },
            showSelected: false
        },
            opts = $.extend(defaults, opts);
        return this.filter(":not([customized])").each(function() {
            $(this).attr("customized", "true");
            if ($(this).is("select")) {
                $(this).wrap("<div class='" + opts.classSelectWrap + "' />");
            }
            if ($(this).is("input:checkbox")) {
                $(this).add("label[for='" + $(this).attr("id") + "']").wrapAll("<div class='" + opts.classCheckboxWrap + "' />");
            }
            if ($(this).is("input:radio")) {
                $(this).add("label[for='" + $(this).attr("id") + "']").wrapAll("<div class='" + opts.classRadioWrap + "' />");
            }

            var $that = this,
                $parent = $(this).parent(),
                check_status = 0,
                holder = "." + opts.classHolder,
                options = "." + opts.classOptions,
                selected = "." + opts.classSelected,
                toggle = "." + opts.classToggle,
                $label, $clone;

            // For selects:
            var buildSelect = function() {
                var selectedText = $("option:selected", $parent).text();
                $(selected, $parent).text(selectedText);
            },

                buildOptions = function() {
                    for (var i = 0; i <= quantity - 1; i++) {
                        opts.showSelected ?
                            $(options, $parent)
                                .append("<li><a class='pos_" + parseInt(i) + "' href='" + $("option", $that).eq(i).val() + "'>" + $("option", $that).eq(i).text() + "</a></li>")
                            : $(options, $parent)
                            .append("<li><a class='pos_" + parseInt(i) + "' href='" + $("option:not(:selected)", $that).eq(i).val() + "'>" + $("option:not(:selected)", $that).eq(i).text() + "</a></li>");
                    }
                    $(options + " a:empty", $parent).parents("li").remove();
                };

            if ($(this).is("select")) {
                var quantity = $("option", this).size();
                $(this).hide().after("<ul class=" + opts.classOptions + "></ul>");
                $(options, $parent).hide();
                $(this).after("<div class='" + opts.classToggle + "'></div>"
                    + "<div class=" + opts.classSelected + "></div>");
                $(selected + ", " + toggle + ", " + options, $parent).wrapAll("<div class='" + opts.classHolder + "'></div>")
                buildSelect();
                buildOptions();
                $clone = $(holder, $parent);
                $(selected + ", " + toggle, $parent).toggle(function() {
                    $(options).hide();
                    $(toggle, $parent).addClass(opts.classToggleOpen);
                    $(holder, $parent).addClass(opts.classHolderOpen);
                    var $_that = $(this);
                    $("body").bind("click", function() {
                        $_that.click();
                    });
                    $(options, $parent).slideDown(function() {
                        opts.changeStatusCallback($that, $clone, "open");
                    });
                }, function() {
                    $(options, $parent).hide();
                    $(toggle, $parent).removeClass(opts.classToggleOpen);
                    $(holder, $parent).removeClass(opts.classHolderOpen);
                    $("body").unbind("click");
                    opts.changeStatusCallback($that, $clone, "close");
                });
                $(options + " a", $parent).click(function() {
                    var val = $(this).attr("href"), text = $(this).text();
                    $("option[value=" + val + "]", $that).attr("selected", "selected");
                    $(selected, $parent).text(text);
                    $(options, $parent).hide();
                    $(holder, $parent).removeClass(opts.classHolderOpen);
                    opts.changeStatusCallback($that, $clone, "close");
                    return false;
                });
            }

            // For checkboxes:
            if ($(this).is("input:checkbox")) {
                var $chkbx = $(this).hide();
                $clone = $parent;
                $label = $("label[for='" + $(this).attr("id") + "']");
                if ($(this).is(":checked")) {
                    check_status = 1;
                    $label.addClass(opts.classCheckboxOn);
                    $label.toggle(function() {
                        check_status = 0;
                        $(this).removeClass(opts.classCheckboxOn);
                        $chkbx.removeAttr("checked", "checked");
                        opts.changeStatusCallback($chkbx, $clone, check_status);
                    }, function() {
                        $(this).addClass(opts.classCheckboxOn);
                        check_status = 1;
                        $chkbx.attr("checked", "checked");
                        opts.changeStatusCallback($chkbx, $clone, check_status);
                    });
                } else {
                    $label.toggle(function() {
                        $(this).addClass(opts.classCheckboxOn);
                        check_status = 1;
                        $chkbx.attr("checked", "checked");
                        opts.changeStatusCallback($chkbx, $clone, check_status);
                    }, function() {
                        $(this).removeClass(opts.classCheckboxOn);
                        check_status = 0;
                        $chkbx.removeAttr("checked", "checked");
                        opts.changeStatusCallback($chkbx, $clone, check_status);
                    });
                }
            }

            // For radiobuttons:
            if ($(this).is("input:radio")) {
                var $radio = $(this).hide();
                $clone = $parent;
                $label = $("label[for=" + $radio.attr("id") + "]");
                var r_name = $radio.attr("name");
                if ($radio.is(":checked"))
                    $label.addClass(opts.classRadioOn);
                $("input[name='" + r_name + "']").each(function() {
                    var r_id = $(this).attr("id");
                    $("label[for=" + r_id + "]").attr("rel", r_name);
                });
                $("label[rel=" + r_name + "]").click(function() {
                    var id = $(this).attr("for");
                    if (!$("#" + id).is(":checked")) {
                        $("label[rel=" + r_name + "]").removeClass(opts.classRadioOn);
                        $(this).addClass(opts.classRadioOn);
                        check_status = 1;
                        opts.changeStatusCallback($("#" + id), $("#" + id).parent(), check_status);
                    }
                });
            }

            // Callback after initialization
            opts.initCallback($(this), $clone);

        });
    };
})(jQuery);