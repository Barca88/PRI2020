//add submition option
function addfile() {
    console.log('New Option available');

    var newOption = $('<input class="w3-input w3-border w3-amber" type="file" name="myFile">')

    $("#form").append(newOption)
}