import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import * as groupsActions from '../../store/groups'
import * as eventsActions from '../../store/events'


function EventForm() {



    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [price, setPrice] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [type, setType] = useState("")
    const [privacy, setPrivacy] = useState("")
    const [img, setImg] = useState("")
    const [vaErrors, setVaErrors] = useState({})
    const his = useHistory()
    const dispatch = useDispatch()
    const [sub, setSub] = useState(false)
    const [group, setGroup] = useState({})
    const [backErrors, setBackErrors] = useState({})


    // console.log(create)
    const { id } = useParams()
    // const group = useSelector(state => state.groups.singleGroup);


    useEffect(() => {
        async function loadGroup() {
            let grabGroup = await dispatch(groupsActions.thunkGetGroup(id));

            setGroup(grabGroup)


        }
        loadGroup();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSub(true)
        setBackErrors({})

        if (Object.keys(vaErrors).length) { return }

        let imgCheck = await checkImage(img)

        if (!imgCheck) {

            setVaErrors({ Img: "url needs to be an accepted image format" })
            return
        }





        let privateVar;
        if (privacy === "private") {
            privateVar = true
        } else { privateVar = false }




        // create

        const newEvent = {
            name, about, type, price, private: privateVar,
            img, startTime, endTime, id
        }

        const res = await dispatch(eventsActions.thunkCreateEvent(newEvent))



        // .catch(async (res) => {
        //     const data = await res.json();
        //     console.log(data)
        //     if (data && data.errors) {
        //       setBackErrors(data.errors);
        //       console.log(backErrors)
        //       return
        //     }


        if (res.errors) {
            setBackErrors(res.errors)
            console.log("back errrors after response", backErrors)

        } else {
            his.push(`/events/${res.id}`)
        }




        // });


        // if (res.id) {
        //     his.push(`/events/${res.id}`)
        // } else {
        //     setVaErrors(res)
        // }if (Object.keys(vaErrors).length)



    }

    async function checkImage(url) {

        const res = await fetch(url);
        const buff = await res.blob();

        return buff.type.startsWith('image/')

    }
    useEffect(() => {
        const err = {}

        if (name.length < 5) err['Name'] = "Name must be at least 5 characters "
        if (type === "") err["Type"] = "Event Type is required"
        if (privacy === "") err["Privacy"] = "Visibility is required"
        if (price === "") err["Price"] = "Price is required"

        // if (parseFloat(price) === NaN)  {
        //     err["Price"] ="Please provide $$.¢¢ value"

        // }




        if (new Date(endTime).getTime() < new Date(startTime).getTime()) err["EndDate"] = "End date must be after start date"



        if (new Date().getTime() > new Date(startTime).getTime()) err["StartDate"] = "Start date must be after right now"
        if (img === "") err["Img"] = "img url is required"
        if (about.length < 50) err['About'] = "Description needs to be at least 50 characters"
        setVaErrors(err)

    }, [about, name, startTime, endTime, price, privacy, type, img])




    // if(edit) {
    //     if (!Object.keys(group).length) return null
    // }

    return (
        <>
            <div className="column-holder">
                <div className="column">


                    <form onSubmit={handleSubmit}>


                        <div className="">
                            <h4 className='form-title'>Create an event for {group.name}</h4>

                            <p className="Ef-text">What is the name of the event?</p>
                            <label htmlFor="name"></label>
                            <input className="Gc-input"
                                type="text"
                                id="name"
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                placeholder="Event Name"
                                value={name}
                            />
                            {vaErrors.Name && sub && <p className='error-text'>*{vaErrors.Name}</p>}
                        </div>
                        <div className='Gc-div'>
                            <p className="Ef-text">Is this an in person or online event?</p>
                            <label htmlFor="eventType"></label>
                            <select className="Gc-input"
                                value={type}
                                onChange={e => setType(e.target.value)}
                                id="eventType"
                            >
                                <option value='' disabled>{'(Select one)'}</option>
                                <option>
                                    Online
                                </option>
                                <option>
                                    In person
                                </option>
                            </select>
                            {vaErrors.Type && sub && `* ${vaErrors.Type}`}

                            <p className="Ef-text">Is this event private or public?</p>
                            <label htmlFor="eventPrivacy"></label>
                            <select className="Gc-input"
                                value={privacy}
                                onChange={e => setPrivacy(e.target.value)}
                                id="eventPrivacy"
                            >
                                <option value='' disabled>{'(Select one)'}</option>
                                <option>
                                    public
                                </option>
                                <option>
                                    private
                                </option>
                            </select>
                            {vaErrors.Privacy && sub && <p className='error-text'>*{vaErrors.Privacy}</p>}

                            <p className="Ef-text">What is the price of the event?</p>
                            <label for="price"></label>
                            <input className="Gc-input" type="text" id="price" name="price" onChange={(e) => {
                                setPrice(e.target.value)

                            }}
                                placeholder='0'
                                value={price}
                            ></input>
                            {vaErrors.Price && sub && <p className='error-text'>*{vaErrors.Price}</p>}
                            {backErrors.price && sub && <p className='error-text'>*please provide a valid price</p>}
                        </div>


                        <div className='Gc-div'>
                            <p className="Ef-text">When does your event start?</p>
                            <input className="Gc-input" type='datetime-local' onChange={(e) => setStartTime(e.target.value)} value={startTime} />
                            {vaErrors.StartDate && sub && <p className='error-text'>*{vaErrors.StartDate}</p>}
                            <p className="Ef-text">When does your event end?</p>
                            <input className="Gc-input" type='datetime-local' onChange={(e) => setEndTime(e.target.value)} value={endTime} />
                            {vaErrors.EndDate && sub && <p className='error-text'>*{vaErrors.EndDate}</p>}

                        </div>
                        <div className='Gc-div'>
                            <p className="Ef-text">Please add an image url for your event below:</p>
                            <input className="Gc-input" placeholder='Image URL' value={img} onChange={(e) => setImg(e.target.value)} />
                            {vaErrors.Img && sub && <p className='error-text'>*{vaErrors.Img}</p>}
                        </div>
                        <div>
                            <p className="Ef-text">Please describe you event:</p>
                            <textarea className="Gc-input Gc-textarea" placeholder='Please write at least 50 characters' onChange={(e) => setAbout(e.target.value)} value={about} />
                            {vaErrors.About && sub && <p className='error-text'>*{vaErrors.Name}</p>}
                        </div>
                        <button type='submit' className={sub && (vaErrors["Name"] || vaErrors["About"] || vaErrors["StartDate"] || vaErrors["EndDate"] || vaErrors["Img"] || vaErrors["Price"] || vaErrors["Privacy"] || vaErrors["Type"]) ? "dis-but" : "red-but cursor"}
                            disabled={sub && (vaErrors["Name"] || vaErrors["About"] || vaErrors["StartDate"] || vaErrors["EndDate"] || vaErrors["Img"] || vaErrors["Price"] || vaErrors["Privacy"] || vaErrors["Type"]) ? true : false}
                        >Create Event</button>

                    </form>
                </div>
            </div>



        </>

    );
}

export default EventForm;
