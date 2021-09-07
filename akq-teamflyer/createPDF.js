const { jsPDF } = window.jspdf;

/* ------------------------------ Create and save PDF ------------------------------ */
function createPDF() {
    // Generate PDF from List
    let pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
    });

    // set text styles
    pdf.setTextColor('#666666');
    pdf.setFontSize(12);

    // create array of first names & portrait images
    let firstNames = []
    let portraitArray = [];

    for (let i = 0; i < teamMembers.length; i++) {
        // first names
        firstNames.push(teamMembers[i].name.split(" ")[0])
        // portraits
        let portrait = new Image();
        portrait.src = teamMembers[i].portrait;
        portraitArray.push(portrait);
    }

    // set default for columns and rows
    let column = 0;
    let imgRow = 12;
    let textRow = 58.6;

    for (let i = 0; i < portraitArray.length; i++) {
        console.log("Creating " + firstNames[i]);
        // set new y position after every 5 teammembers to start new row
        if (i % 5 === 0 && i % 15 !== 0) {
            imgRow = imgRow + 68.1;
            textRow = textRow + 68.1;
        }

        // reset y position after 15 team-members to start on top of new page
        if (i % 15 === 0) {
            imgRow = 12;
            textRow = 58.6;
        }

        pdf.addImage(portraitArray[i], 'PNG', 12 + column * 55.8, imgRow, 49.8, 49.8, firstNames[i], 'SLOW', 0);
        pdf.text(firstNames[i], 36.9 + column * 55.8, textRow, 'center');

        // add new page after 15 team-members
        if (i % 14 === 0 && i !== 0) {
            pdf.addPage();
        }

        // set different x position of teammembers, reset at every 5 teammembers
        if (column < 4) {
            column++;
        } else {
            column = 0;
        }
    }

    // Draw colorstripe on top edge of the document
    const pageCount = pdf.internal.getNumberOfPages();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const rectFillColors = ['#A8C322', '#32A546', '#05806E', '#17518E', '#C13B70', '#E7324C', '#F3920F', '#FFCC00'];
    const rectSize = pageWidth / rectFillColors.length;

    for (var i = 1; i <= pageCount; i++) {
        // Go to page i
        pdf.setPage(i);

        for (let j = 0; j < rectFillColors.length; j++) {
            pdf.setFillColor(rectFillColors[j]);
            pdf.rect(j * rectSize, 0, rectSize, 3, 'F');
        }
    }

    pdf.save('team.pdf');
}