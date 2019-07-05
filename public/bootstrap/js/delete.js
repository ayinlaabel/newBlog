$(document).ready( () => {
    $('.deleteArticle').on('click', (e) => {
        $target = $(e.target);
        var id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/article/'+id,
            success: (response) => {
                alert('Deleting Article');
                window.location.href= '/';
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
});