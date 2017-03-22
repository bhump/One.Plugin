(function ($) {

    var globalUpdateUrl = "";
    var globalId = "";
    var globalField = "";
    var globalText = ""

    $.fn.one = function (options) {

        var $table = this;
        var tableId = $table.attr('id');

        $table.attr('data-url', options.updateUrl);

        var o = jQuery.extend({}, jQuery.fn.one.defaults, options, {

            init: function (item) {

                var $item = $(item);

                $($item).find('tr').each(function () {
                    globalUpdateUrl = options.updateUrl;

                    var rowId = $(this).find('td:first').text();

                    $('td', this).each(function (i, v) {

                        $currentCell = $(this);

                        $(o.editableColumns).each(function (index, value) {

                            if (i.toString() == value) {

                                var label = "";

                                $currentCell.addClass('one-cell');

                                if (o.type === "gridview") {
                                    label = $currentCell.find('span');
                                }
                                else {
                                    label = $currentCell.find('label');
                                }

                                label.addClass('one-label');

                                var markup = + "";

                                $(o.textColumns).each(function (textIndex, textValue) {
                                    if (i.toString() == textValue)
                                        markup = '<input type="text" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                });

                                $(o.numberColumns).each(function (numberIndex, numberValue) {
                                    if (i.toString() == numberValue)
                                        markup = '<input type="number" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                });

                                $(o.emailColumns).each(function (emailIndex, emailValue) {
                                    if (i.toString() == emailValue)
                                        markup = '<input type="email" name="email" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '" required></input>';
                                });

                                $(o.telColumns).each(function (telIndex, telValue) {
                                    if (i.toString() == telValue)
                                        markup = '<input type="tel" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                });

                                $(o.checkboxColumns).each(function (checkboxIndex, checkboxValue) {
                                    if (i.toString() == checkboxValue) {
                                        label.removeClass('one-label').addClass('one-label-checkbox').addClass('hidden');
                                        var isActive = label.attr('data-onebool');
                                        if (isActive === "True") {
                                            markup = '<input type="checkbox" class="one-checkbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '" checked></input>';
                                        }
                                        else {
                                            markup = '<input type="checkbox" class="one-checkbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                        }
                                    }
                                });

                                $currentCell.append(markup);
                            }
                        });
                    });
                });
            },

            DeactivateCells: function () {
                console.log($table);
                $($table).find('.one-cell').removeClass('active-one');
                $($table).find('.one-label').removeClass('active-one-label').removeClass('hidden');
                $($table).find('.one-textbox').addClass('hidden').removeClass('active-one-textbox');
            },

            UpdateDatabase: function (id, field, text) {

                var data = {
                    "id": id,
                    "field": field,
                    "text": text
                };

                $.ajax({
                    type: 'Post',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    url: globalUpdateUrl,
                    contentType: 'application/json',
                    cache: false,
                    success: function (result) {
                        console.log("Update Successful.");
                    },
                    error: function (response) {
                        alert("Uh Oh. :( Update was unsuccessful. ");
                    }
                });

            }

        });

        o.init(this);

        $(document).on('click', '.one-cell', function () {
            o.DeactivateCells();

            var $activeCell = $(this);

            $activeCell.addClass('active-one');
            var textbox = $activeCell.find('.one-textbox');
            textbox.addClass('active-one-textbox').removeClass('hidden');

            var label = $activeCell.find('.one-label');
            label.addClass('active-one-label').addClass('hidden');

            textbox.val(label.html());
        });

        $(document).on('keyup', '.active-one-textbox', function () {
            var id = $(this).data('id');
            var field = $(this).data('field');
            var $row = $('.active-one').parents('tr');

            var $parentTable = $row.parents('table');
            $('.active-one-label').html($('.active-one-textbox').val());
            globalId = id;
            globalField = field;
            globalText = $('.active-one-textbox').val();
            globalUpdateUrl = $parentTable.attr('data-url');
        });

        $(document).on('change', '.one-checkbox', function () {
            var id = $(this).data('id');
            var field = $(this).data('field');

            var $row = $('.active-one').parents('tr');
            var $parentTable = $row.parents('table');

            if ($(this).is(':checked')) {
                globalText = "True";
            }
            else {
                globalText = "False";
            }

            globalId = id;
            globalField = field;
            globalUpdateUrl = $parentTable.attr('data-url');

            if (globalId != "") {
                o.UpdateDatabase(globalId, globalField, globalText, globalUpdateUrl);
                globalId = "";
                globalField = "";
                globalText = "";
                globalUpdateUrl = "";
            }
        });

        $('body').on('click', function () {

            if (globalId != "") {
                o.UpdateDatabase(globalId, globalField, globalText, globalUpdateUrl);
                globalId = "";
                globalField = "";
                globalText = "";
                globalUpdateUrl = "";
            }

            o.DeactivateCells();
        });
    };

    $.fn.one.defaults = {
        type: "html",
        columns: 5,
        editableColumns: [1, 2, 3, 4, 5],
        textColumns: [1, 2, 3, 4, 5],
        emailColumns: [],
        passwordColumns: [],
        checkboxColumns: [],
        radioColumns: [],
        dateColumns: [],
        telColumns: [],
        numberColumns: [],
        updateUrl: ""
    };
})(jQuery);


