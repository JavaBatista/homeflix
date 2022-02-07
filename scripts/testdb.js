

var jsstoreCon = new JsStore.Connection(new Worker("scripts/jsstore/jsstore.worker.js"));

window.onload = function () {
    refreshTableData();
    registerEvents();
    initDb();
};

async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created');
    }
    else {
        console.log('db opened');
    }
}

function getDbSchema() {
    var table = {
        name: 'Movie',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                notNull: true,
                dataType: 'string'
            },
            gender: {
                dataType: 'string',
                default: 'male'
            },
            country: {
                notNull: true,
                dataType: 'string'
            },
            city: {
                dataType: 'string',
                notNull: true
            }
        }
    }

    var db = {
        name: 'Movie-Db',
        tables: [table]
    }
    return db;
}

function registerEvents() {
    $('#btnAddMovie').click(function () {
        showFormAndHideGrid();
    })
    $('#btnPopulateDatabase').click(function () {
        populateDatabase();
    })
    $('#btnClearDatabase').click(function () {
        var result = confirm('Are you sure, you want to delete the table?');
        if (result) {
            clearTable('Movie');
        }
    })
    $('#tblGrid tbody').on('click', '.edit', function () {
        var row = $(this).parents().eq(1);
        var child = row.children();
        var movie = {
            id: row.attr('itemid'),
            name: child.eq(0).text(),
            gender: child.eq(1).text(),
            country: child.eq(2).text(),
            city: child.eq(3).text()
        }
        refreshFormData(movie);
        showFormAndHideGrid();
    });
    $('#tblGrid tbody').on('click', '.delete', function () {
        var result = confirm('Are you sure, you want to delete?');
        if (result) {
            var movieId = $(this).parents().eq(1).attr('itemid');
            deleteMovie(Number(movieId));
        }
    });
    $('#btnSubmit').click(function () {
        var movieId = $('form').attr('data-movie-id');
        if (movieId) {
            updateMovie();
        }
        else {
            addMovie();
        }
    });
}


//This function refreshes the table
async function refreshTableData() {
    try {
        var htmlString = "";
        var movies = await jsstoreCon.select({
            from: 'Movie'
        });
        movies.forEach(function (movie) {
            htmlString += "<tr ItemId=" + movie.id + "><td>" +
                movie.name + "</td><td>" +
                movie.gender + "</td><td>" +
                movie.country + "</td><td>" +
                movie.city + "</td><td>" +
                "<a href='#' class='edit'>Edit</a></td>" +
                "<td><a href='#' class='delete''>Delete</a></td>";
        })
        $('#tblGrid tbody').html(htmlString);
    } catch (ex) {
        alert(ex.message)
    }
}



async function addMovie() {
    var movie = getMovieFromForm();
    try {
        var noOfDataInserted = await jsstoreCon.insert({
            into: 'Movie',
            values: [movie]
        });
        if (noOfDataInserted === 1) {
            refreshTableData();
            showGridAndHideForm();
        }
    } catch (ex) {
        alert(ex.message);
    }

}

async function populateDatabase() {
    // data foi declarada no arquivo data.js
    var movie = data;
    try {
        var noOfDataInserted = await jsstoreCon.insert({
            into: 'Movie',
            values: movie
        });
        if (noOfDataInserted === movie.length) {
            refreshTableData();
        }
    } catch (ex) {
        alert(ex.message);
    }

}

async function updateMovie() {
    var movie = getMovieFromForm();
    try {
        var noOfDataUpdated = await jsstoreCon.update({
            in: 'Movie',
            set: {
                name: movie.name,
                gender: movie.gender,
                country: movie.country,
                city: movie.city
            },
            where: {
                id: movie.id
            }
        });
        console.log(`data updated ${noOfDataUpdated}`);
        showGridAndHideForm();
        $('form').attr('data-movie-id', null);
        refreshTableData();
        refreshFormData({});
    } catch (ex) {
        alert(ex.message);
    }
}

async function deleteMovie(id) {
    try {
        var noOfMovieRemoved = await jsstoreCon.remove({
            from: 'Movie',
            where: {
                id: id
            }
        });
        console.log(`${noOfMovieRemoved} movies removed`);
        refreshTableData();
    } catch (ex) {
        alert(ex.message);
    }
}

async function clearTable(table_name){
    try {
        await jsstoreCon.clear(table_name);
        console.log('data cleared successfully');
        refreshTableData();
    } catch (ex) {
        alert(ex.message);
    }
}



function getMovieFromForm() {
    var movie = {
        id: Number($('form').attr('data-movie-id')),
        name: $('#txtName').val(),
        gender: $("input[name='gender']:checked").val(),
        country: $('#txtCountry').val(),
        city: $('#txtCity').val()
    };
    return movie;
}

function showFormAndHideGrid() {
    $('#formAddUpdate').show();
    $('#tblGrid').hide();
}

function showGridAndHideForm() {
    $('#formAddUpdate').hide();
    $('#tblGrid').show();
}

function refreshFormData(movie) {
    $('form').attr('data-movie-id', movie.id);
    $('#txtName').val(movie.name);
    $(`input[name='gender'][value=${movie.gender}]`).prop('checked', true);
    $('#txtCountry').val(movie.country);
    $('#txtCity').val(movie.city);
}