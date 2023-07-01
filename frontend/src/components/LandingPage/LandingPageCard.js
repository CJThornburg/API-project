

function LandingPage({index}) {


    const imgSrc=[ "https://cdn-icons-png.flaticon.com/512/5363/5363451.png",, ]


    return (
        <>
            <div className="lP-card">
                <img src={imgSrc[index]}></img>
                <h3>See fellow Groups</h3>
                <p>dsfds sdfldsjf sdfldsj sdflkdsj sfdlskjf sdfkdslj </p>
            </div>
        </>
    );
}

export default LandingPage;
