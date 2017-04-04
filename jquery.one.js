(function ($) {

    var globalDeleteUrl = "";
    var globalUpdateUrl = "";
    var globalId = "";
    var globalField = "";
    var globalText = "";

    $.fn.one = function (options) {

        var $table = this;
        var tableId = $table.attr('id');

        $table.attr('data-updateurl', options.updateUrl);
        $table.attr('data-deleteurl', options.deleteUrl);

        var o = jQuery.extend({}, jQuery.fn.one.defaults, options, {

            init: function (item) {

                var $item = $(item);

                $($item).find('tr').each(function (trIndex, trValue) {

                    globalUpdateUrl = options.updateUrl;
                    globalDeleteUrl = options.deleteUrl;

                    var rowId = $(this).find('td:first').text();

                    if (o.delete) {
                        if ($(this).index() != 0) {
                            $(this).append("<td><a id='aDelete' class='delete' data-deleteid='" + rowId + "'>Delete</a></td>");
                        } else {
                            $(this).append("<td></td>");
                        }
                    }

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
                                        markup = '<input type="text" tabindex="' + textValue + '" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                });

                                $(o.numberColumns).each(function (numberIndex, numberValue) {
                                    if (i.toString() == numberValue)
                                        markup = '<input type="number" class="hidden one-textbox one-number field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                });

                                $(o.emailColumns).each(function (emailIndex, emailValue) {
                                    if (i.toString() == emailValue)
                                        markup = '<input type="email" name="email" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '" required></input>';
                                });

                                $(o.telColumns).each(function (telIndex, telValue) {
                                    if (i.toString() == telValue)
                                        markup = '<input type="tel" class="hidden one-textbox field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
                                });

                                $(o.dateColumns).each(function (dateIndex, dateValue) {
                                    if (i.toString() == dateValue)
                                        markup = '<input type="date" class="hidden one-textbox one-date field-' + value + '" data-id="' + rowId + '" data-field="field' + value + '"></input>';
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

                    $(':input').each(function (i) {
                        $(this).attr('tabindex', i + 1);
                    });

                });
            },

            DeactivateCells: function () {
                $(document).find('.one-cell').removeClass('active-one');
                $(document).find('.one-label').removeClass('active-one-label').removeClass('hidden');
                $(document).find('.one-textbox').addClass('hidden').removeClass('active-one-textbox');
            },

            UpdateRecord: function (id, field, text) {

                console.log("Global Update Url: " + globalUpdateUrl);
                console.log("Field: " + field);
                console.log("Text: " + text);

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
                        console.log(response);
                        alert("Uh Oh. :( Update was unsuccessful. ");
                    }
                });

            },

            DeleteRecord: function (id) {
                var data = {
                    "id": id
                }

                $.ajax({
                    type: 'Post',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    url: globalDeleteUrl,
                    contentType: 'application/json',
                    cache: false,
                    success: function (result) {
                        console.log("Update Successful.");
                    },
                    error: function (response) {
                        console.log(response);
                        alert("Uh Oh. :( Update was unsuccessful. ");
                    }
                });
            }

        });

        o.init(this);

        $($table).on('click', '.one-cell', function (e) {

            var $row = $(this).parents('tr');
            var $parentTable = $row.parents('table');

            globalUpdateUrl = $parentTable.attr('data-updateurl');
            console.log("GlobalText: " + globalText);
            o.DeactivateCells();

            if (globalId != "") {
                o.UpdateRecord(globalId, globalField, globalText);
                globalId = "";
                globalField = "";
                globalText = "";
                globalUpdateUrl = "";
            }

            var $activeCell = $(this);

            $activeCell.addClass('active-one');
            var $textbox = $activeCell.find('.one-textbox');
            $textbox.addClass('active-one-textbox').removeClass('hidden');

            var $label = $activeCell.find('.one-label');
            $label.addClass('active-one-label').addClass('hidden');

            var $checkbox = $activeCell.find('.one-checkbox');

            //If cell click equals the checkbox, return to show check/uncheck
            if (e.target === $checkbox[0]) return true;

            //If cell click equals the textbox don't return
            if (e.target === $textbox[0]) return false;

            $textbox.val($label.html());

            return false;
        });

        $($table).on('keydown', '.active-one-textbox', function (e) {

            var id = $(this).data('id');
            var field = $(this).data('field');
            var $row = $(this).parents('tr');

            var $parentTable = $row.parents('table');

            var $textbox = $('.active-one-textbox');

            if ($($textbox).hasClass("one-date")) {
                var split = $textbox.val().split('-');
                var day = split[2];
                var month = split[1];
                var year = split[0];
                $('.active-one-label').html(month + "/" + day + "/" + year);
            } else {
                $('.active-one-label').html($textbox.val());
            }

            globalId = id;
            globalField = field;
            globalText = $('.active-one-textbox').val();
            globalUpdateUrl = $parentTable.attr('data-updateurl');

            if (e.which == 9) {

                var currentTabIndex = $textbox.attr('tabIndex');
                console.log(currentTabIndex);

                if (globalId != "") {
                    o.UpdateRecord(globalId, globalField, globalText);
                    globalId = "";
                    globalField = "";
                    globalText = "";
                    globalUpdateUrl = "";
                }

                o.DeactivateCells();

                var nextTabIndex = (parseInt(currentTabIndex) + 1).toString();

                var $nextInput = $('input[tabindex="' + nextTabIndex + '"]');

                var $nextCell = $nextInput.parent('td');
                var $nextLabel = $nextCell.find('.one-label');
                var $nextTextbox = $nextCell.find('.one-textbox');

                if ($nextCell != null && $nextTextbox != null) {

                    $nextCell.addClass('active-one');
                    $nextLabel.addClass('hidden').addClass('active-one-label');
                    $nextTextbox.removeClass('hidden').addClass('active-one-textbox');
                    $nextTextbox.val($nextLabel.html());
                }
            }
        });

        $($table).on('keyup', '.active-one-textbox', function (e) {

            var id = $(this).data('id');
            var field = $(this).data('field');
            var $row = $(this).parents('tr');
            var $parentTable = $row.parents('table');
            var $textbox = $('.active-one-textbox');

            if ($($textbox).hasClass("one-date")) {
                var split = $textbox.val().split('-');
                var day = split[2];
                var month = split[1];
                var year = split[0];
                $('.active-one-label').html(month + "/" + day + "/" + year);
            } else {
                $('.active-one-label').html($textbox.val());
            }

            globalText = $('.active-one-textbox').val();
        });

        //Change event for up and down arrows on a number input.
        $($table).on('change', '.active-one-textbox.one-number', function () {
            var id = $(this).data('id');
            var field = $(this).data('field');
            var $row = $('.active-one').parents('tr');

            var $parentTable = $row.parents('table');
            $('.active-one-label').html($('.active-one-textbox').val());
            globalId = id;
            globalField = field;
            globalText = $('.active-one-textbox').val();
            globalUpdateUrl = $parentTable.attr('data-updateurl');
        });

        $($table).on('click', '.one-checkbox', function () {

            var id = $(this).data('id');
            var field = $(this).data('field');

            var $row = $(this).parents('tr');
            var $parentTable = $row.parents('table');

            var $checkbox = $(this);

            if ($(this).prop('checked')) {
                $checkbox.prop('checked', true);
                globalText = "True";
            }
            else {
                $checkbox.prop('checked', false);
                globalText = "False";
            }

            globalId = id;
            globalField = field;
            globalUpdateUrl = $parentTable.attr('data-updateurl');

            if (globalId != "") {
                o.UpdateRecord(globalId, globalField, globalText);
                globalId = "";
                globalField = "";
                globalText = "";
                globalUpdateUrl = "";
            }
        });

        $('.delete').on('click', function () {

            var id = $(this).attr('data-deleteid');
            var $row = $(this).parents('tr');
            var $parentTable = $row.parents('table');

            globalDeleteUrl = $parentTable.attr('data-deleteurl');

            $($row).hide();

            o.DeleteRecord(id);
        });

        $('body').on('click', function () {

            if (globalId != "") {
                o.UpdateRecord(globalId, globalField, globalText);
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
        updateUrl: "", 
        deleteUrl: "",
        delete: false
    };
})(jQuery);


