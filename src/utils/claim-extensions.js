var count = 0;
ProfectusCommon.util.ready(function() {

    // var avatar = document.getElementById('user-avatar').cloneNode(true);
    // avatar.removeAttribute('id');
    // document.getElementById('claim-comment-current-user-avatar').appendChild(avatar);

    const detailsPanel = document.getElementById('claim-details-panel');
    //const attachmentsPanel = document.getElementById('claim-attachments-panel');

    // attachmentsPanel.style.minHeight = `${detailsPanel.clientHeight}px`;
    // attachmentsPanel.style.maxHeight = `${detailsPanel.clientHeight}px`;
    //attachmentsPanel.style.height = `${detailsPanel.clientHeight}px`;

/*
    var detailsPanel = document.getElementById('claim-details-panel');
    new ResizeSensor(detailsPanel, function() {

        var attachmentsPanel = document.getElementById('claim-attachments-panel');
        var height = Math.max(detailsPanel.clientHeight, attachmentsPanel.clientHeight);
        detailsPanel.style.minHeight = height + 'px';
        attachmentsPanel.style.minHeight = height + 'px';

    });
*/
});
