$(document).ready( () => {
    $('.delete-article').on('click', function (e) {
        $target = $(e.target);
        var id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/article/'+id,
            success:  (response) => {
                alert('Deleting Article');
                window.location.href= '/';
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
});


// $(document).ready(function () {
//     $('.deleteSportArticle').on('click', function (err) {
//         $target = $(e.target);
//         var id = $target.attr('data-id');
//         $.ajax({
//             type: 'DELETE',
//             url: '/article/'+id,
//             success: function (response) {
//                 alert('Deleting Sport Article');
//                 window.location.href='/article/sportNews'
//             },
//             error: function (err) {
//                 console.log(err);
//             }
//         });
//     });
// });