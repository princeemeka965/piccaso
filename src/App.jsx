import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import { FaArrowAltCircleDown } from 'react-icons/fa';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { Transformation } from "@cloudinary/url-gen";
import { scale, fill, crop } from "@cloudinary/url-gen/actions/resize";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { byAngle } from "@cloudinary/url-gen/actions/rotate"
import { vignette } from "@cloudinary/url-gen/actions/effect";
import { byRadius, max } from "@cloudinary/url-gen/actions/roundCorners";
import { saturation, hue } from "@cloudinary/url-gen/actions/adjust";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { image, text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

export default function App() {
    const [images, setImage] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [cardData, setPayload] = useState({});
    const [home, setHomePage] = useState(true);
    const [cardPage, setCardPage] = useState(false);
    const [fullNames, setFullNames] = useState('');
    const [options, setUserOptions] = useState("");
    const [loader, setLoader] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [christmasCards, setChristmasCards] = useState([]);
    const [christmasTexts, setChristmasTexts] = useState([]);
    let formRef = useRef();

    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'campnet'
        }
    });

    const ChristmasCards = ["chrome_EzDQ6VVPO4_oddfqz", "chrome_uL1eLKwAiF_jtpcet", "chrome_fGb8YN86KT_ci7p7g", "5_hgrzlj", "4_vctgle", "2_ezokjw", "chrome_ecIrrVLjHc_u2neit", "3_spt6rm"];
    const ChristmasTexts = ["From our home to yours, we wish you a very \n Merry Christmas and a happy holiday season!",
        "May the Christmas Season bring only happiness and joy to you and your family.",
        "Wishing you a joyous Christmas and a prosperous New Year.",
        "The gift of love. The gift of peace. The gift of happiness. \n May all these be yours this Christmas.",
        "May the peace and joy of Christmas be with you \n today and throughout the New Year.",
        "Wishing you a lovely Christmas season and a very Happy New Year!",
        "Wishing you and your family a wonderful Christmas and a blessed New Year!",
        "May your Christmas sparkle with moments of love, laughter and goodwill. \n And may the year ahead be full of contentment and joy. \n Have a Merry Christmas!"
    ];

    const previewImage = (index) => {
        html2canvas(document.querySelector(`.item${index}`), {
            allowTaint: true,
            useCORS: true,
        }).then(function (canvas) {
            var anchorTag = document.createElement("a");
            document.body.appendChild(anchorTag);
            //document.body.appendChild(canvas);
            anchorTag.download = "piccaso_image.jpg";
            anchorTag.href = canvas.toDataURL();
            anchorTag.target = '_blank';
            anchorTag.click();
        });
    };

    const setOptions = (event) => {
        setUserOptions(event.target.value);
    };

    const setName = (event) => {
        setFullNames(event.target.value);
    }

    const handleSubmit = (event, imageData) => {
        event.preventDefault();
        setLoader(true);

        const formData = new FormData();
        formData.append("file", imageData);
        formData.append("upload_preset", "do2sxxwq");

        axios
            .post(`https://api.cloudinary.com/v1_1/campnet/upload`, formData)
            .then((response) => {
                setImage(response.data.secure_url);
                setImageId(response.data.public_id);
                setLoader(false);
            });
    };

    const submitForm = (event) => {
        event.preventDefault();
        const payload = { name: fullNames, photo: imageId };
        setDisableBtn(true);
        reshuffleCards(ChristmasCards);
        reshuffleText(ChristmasTexts);

        setTimeout(() => {
            setHomePage(false);
            setPayload(payload);
            setCardPage(true);
            setDisableBtn(false);
        }, 4000)
    }

    const reshuffleCards = (cards) => {
        let currentIndex = cards.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [cards[currentIndex], cards[randomIndex]] = [
                cards[randomIndex], cards[currentIndex]];
        }

        setChristmasCards(cards);
    }

    const reshuffleText = (texts) => {
        let currentIndex = texts.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [texts[currentIndex], texts[randomIndex]] = [
                texts[randomIndex], texts[currentIndex]];
        }

        setChristmasTexts(texts);
    }

    let arr = Array.apply(null, { length: 8 }).map(Number.call, Number);

    const imageProcessing = (cards,texts) => {
        if (cards) {
            // Use the image with public ID, 'front_face'.
            const myImage = cld.image(`${cards}`);

            // Apply the transformation.
            cardData.photo ? (
                myImage
                    .resize(fill().height(500).width(920).gravity('south'))
                    .overlay(
                        source(
                            image(`${cardData.photo}`)
                                .transformation(new Transformation()
                                    .resize(crop().width(1.5).height(1.5).gravity(focusOn(FocusOn.faces())).regionRelative())
                                    .adjust(saturation(50))
                                    .effect(vignette())
                                    .resize(scale().width(250))
                                    .roundCorners(max())
                                )
                        )
                            .position(new Position().gravity(compass('center')).offsetX(1).offsetY(-20))
                    )
                    .overlay(
                        source(
                            text('Merry Christmas', new TextStyle('Cookie', 70)
                                .fontWeight('bold'))
                                .textColor('#fff')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(1).offsetY(-200))
                    )
                    .overlay(
                        source(
                            text(`${texts}`, new TextStyle('Cookie', 35)
                                .fontWeight('bold'))
                                .textColor('#fff')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(1).offsetY(120))
                    )
                    .overlay(
                        source(
                            text(`${cardData.name}`, new TextStyle('Cookie', 35)
                                .fontWeight('bold'))
                                .textColor('#FFD700')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(1).offsetY(200))
                )
                    .overlay(
                        source(
                            text(`https://github.com/princeemeka965`, new TextStyle('Cookie', 15)
                                .fontWeight('bold'))
                                .textColor('#FFF')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(-100).offsetY(230))
                    )
                    .roundCorners(byRadius(10))
            )
                :
                (myImage
                    .resize(fill().height(500).width(920).gravity('south'))
                    .overlay(
                        source(
                            text('Merry Christmas', new TextStyle('Cookie', 70)
                                .fontWeight('bold'))
                                .textColor('#fff')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(1).offsetY(-200))
                    )
                    .overlay(
                        source(
                            text(`${texts}`, new TextStyle('Cookie', 35)
                                .fontWeight('bold'))
                                .textColor('#fff')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(1).offsetY(120))
                    )
                    .overlay(
                        source(
                            text(`${cardData.name}`, new TextStyle('Cookie', 35)
                                .fontWeight('bold'))
                                .textColor('#FFD700')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(1).offsetY(200))
                )
                    .overlay(
                        source(
                            text(`https://github.com/princeemeka965`, new TextStyle('Cookie', 15)
                                .fontWeight('bold'))
                                .textColor('#FFF')
                                .transformation(new Transformation()
                                    .rotate(byAngle(0)))
                        )
                            .position(new Position().gravity(compass('center')).offsetX(-350).offsetY(240))
                )
                    
                    .roundCorners(byRadius(10))
                );
            
            return <AdvancedImage cldImg={myImage} />
        }
    }


    return (
        <div className="w-full flex flex-col items-center snow">
            <div className="p-4 w-full flex flex-col justify-center">
                <div className="flex w-full justify-center">
                    <img src="https://res.cloudinary.com/campnet/image/upload/c_scale,w_95/v1671897555/piccaso_skd0vi.png" />
                </div>
                <h1 className="flex w-full justify-center">
                    <p className="text-2xl font-bold italic text-white"> PICCASO </p>
                </h1>

                <div className="flex w-full justify-center p-2 my-4">
                    <h1 className="flex-col">
                        <p className="text-base font-semibold text-white">
                            {" "}
                            Create custom Christmas cards and share with loved ones{" "}
                        </p>
                        <p className="text-base font-semibold my-2 text-white">
                            {" "}
                            Enjoy the Yuletide season!!!{" "}
                        </p>
                    </h1>
                </div>
            </div>

            {home ? (<div
                className="w-1/2 p-5 my-2 bg-white rounded-md flex flex-col"
                style={{ width: "80%" }}
            >
                <h1 className="text-lg font-bold text-center">
                    {" "}
                    Create Custom Greetings Card
                </h1>
                <div className="w-full flex justify-center my-4 p-1">
                    <div className="flex flex-col items-center" style={{ width: "100%" }}>
                        <form
                            className="flex flex-col items-center"
                            style={{ width: "100%" }}
                            ref={el => (formRef = el)}
                            onSubmit={submitForm}
                        >
                            <div className="flex mb-1" style={{ width: "70%" }}>
                                <div className="flex flex-grow">
                                    <input
                                        type="radio"
                                        name="options"
                                        value={true}
                                        onChange={setOptions}
                                    />
                                    <label className="ml-2">Photo</label>
                                </div>
                                <div className="flex" style={{ justifyContent: "end" }}>
                                    <input
                                        type="radio"
                                        name="options"
                                        value={false}
                                        onChange={setOptions}
                                    />
                                    <label className="ml-2">No Photo</label>
                                </div>
                            </div>

                            {options === "true" ? (
                                <div
                                    className="mt-4 flex justify-center"
                                    style={{ height: "20vw", position: "relative" }}
                                >
                                    <img
                                        src={
                                            images ? images : "https://i.stack.imgur.com/l60Hf.png"
                                        }
                                        alt="profilepic"
                                        variant="circular"
                                        size="sm"
                                        className="h-full"
                                    />
                                    <input
                                        type="file"
                                        name="images"
                                        style={{ position: "absolute", top: "-1%" }}
                                        onChange={(e) => handleSubmit(e, e.target.files[0])}
                                        className="w-full h-full opacity-0"
                                    />
                                </div>)
                                : (
                                    ""
                                )}

                            {options === "true" ? (
                                loader ? (
                                    <span
                                        className="p-1 mt-2 font-semibold text-sm italic"
                                        style={{ color: "green" }}
                                    >
                                        Uploading Photo...
                                    </span>
                                ) : (
                                    <span className="p-1 mt-2 font-semibold text-sm">
                                        Click on avatar to upload image
                                    </span>
                                )
                            ) : ('')}

                            <div className="flex justify-center mb-1 mt-4" style={{ width: "100%" }}>
                                <input type={'text'} className='p-2 border rounded-md w-3/4' required name='name' placeholder="Enter your name as sender" value={fullNames} onChange={setName} />
                            </div>

                            <div className="flex justify-center mb-1 mt-4" style={{ width: "100%" }}>
                                <button className="p-2 text-white w-3/4 rounded-md font-semibold" disabled={disableBtn} style={{ backgroundColor: 'blue' }}>Submit</button>
                            </div>


                        </form>
                    </div>
                </div>
            </div>) : ''}

            {cardPage ? <div className="w-1/2 p-5 my-2 bg-white rounded-md flex flex-col"
                style={{ width: "80%" }}>
                <ul>
                    {arr.map(item => {
                        return <li key={item} className='flex flex-col justify-center'>
                            <div className={`item${item} my-3`} style={{minHeight: '250px', border: '1px solid #e1e1e1', borderRadius: '5px'}} id={item}>{imageProcessing(christmasCards[item], christmasTexts[item])}</div>
                            <span className="p-2 font-semibold text-sm flex justify-center text-center" onClick={() => previewImage(item)}><FaArrowAltCircleDown className="mt-1 mr-1" />Download</span>
                        </li>
                    })}
                </ul>
            </div>
                :
                ''
            }

        </div>
    );
}
