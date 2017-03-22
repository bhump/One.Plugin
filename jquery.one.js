(function ($) {

    var globalUpdateUrl = "";
    var globalId = "";
    var globalField = "";
    var globalText = ""

    $.fn.one = function (options) {

        var $table = this;
        var tableId = $table.attr('id');

        $table.addClass('one_' + tableId);
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

                                var textboxMarkup = '<input type="text" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                $currentCell.append(textboxMarkup);
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
            console.log($parentTable);
            $('.active-one-label').html($('.active-one-textbox').val());
            globalId = id;
            globalField = field;
            globalText = $('.active-one-textbox').val();
            globalUpdateUrl = $parentTable.attr('data-url');
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
        updateUrl: ""
    };
})(jQuery);


