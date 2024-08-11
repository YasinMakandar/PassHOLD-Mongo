import React, { useRef, useState, useEffect } from 'react'
import { RiLockStarLine } from "react-icons/ri";
import { RiFileLockLine } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import {v4 as uuidv4} from 'uuid';

const Manager = () => {

    const [isPasswordVisible, setisPasswordVisible] = useState(false)
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const ref = useRef()

    const getpasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }
    

    useEffect(() => {
        getpasswords()
       
    }, [])


    const showPassword = () => {
        setisPasswordVisible(!isPasswordVisible)
        if (ref.current.type === "password") {
            ref.current.type = "text";
        } else {
            ref.current.type = "password";
        }

    }

    const savePassword = async() => {
        if(form.site.length>3 && form.password.length>3 && form.username.length>3){

            await fetch("http://localhost:3000/",{method:"DELETE", headers:{"Content-Type":"application/json"},body:JSON.stringify({id:form.id})})

            setPasswordArray([...passwordArray, {...form, id:uuidv4()}])
            await fetch("http://localhost:3000/",{method:"POST", headers:{"Content-Type":"application/json"},body:JSON.stringify({...form, id:uuidv4()})})
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, {...form, id:uuidv4()}]))
            setform({site: "", username: "", password: "" })
            console.log([...passwordArray, form])
        }
        else{
            toast('Error: Not saved!', {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });  
        }
    }
    const deletePassword = async (id) => {
        console.log("Delete", id);
        let c = confirm("Do you want to delete this?")
        if(c){

            setPasswordArray(passwordArray.filter(item=>item.id!==id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item=>item.id!==id)))
            let res = await fetch("http://localhost:3000/",{method:"DELETE", headers:{"Content-Type":"application/json"},body:JSON.stringify({id})})
            
        }
        // console.log([...passwordArray, form])
    }

    const editPassword = (id) =>{
        console.log("Edit", id)
        setform({...passwordArray.filter(item=>item.id===id)[0], id:id})
        setPasswordArray(passwordArray.filter(item=>item.id!==id))
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        toast('Copied to Clipboard', {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    return (

        <>
        
        <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />


        <div className=' flex flex-col justify-center items-center mx-auto text-white my-20 max-w-5xl  '>
            
            <div className="main-text flex-col justify-center items-center gap-2 my-3">
                <div className='text-center font-semibold text-3xl flex justify-center items-center '>
                    <RiLockStarLine />
                    <span>Pass</span><span className='text-gray-400'>HOLD</span></div>
                <div><span className='text-sm text-gray-400 text-center'>Your Strong-Hold For Passwords</span></div>
            </div>
            <div className="inputs flex flex-col justify-center items-center gap-3 w-full">
                <div className="url w-full ">
                    <input onChange={handleChange} value={form.site} placeholder='Enter URL' className='rounded-full w-full text-black p-3 py-1' type="text" name="site" id="site" />
                </div>
                <div className="up flex gap-4 w-full ">
                    <div className='w-full'>
                        <input onChange={handleChange} value={form.username} placeholder='Enter Username' className='w-full rounded-full text-black p-3 py-1' type="text" name='username' id='username' />
                    </div>
                    <div className=''>
                        <input onChange={handleChange} value={form.password} placeholder='Enter Password' className=' w-full rounded-full text-black p-3 py-1 ' type={isPasswordVisible ? "text" : "password"} ref={ref} name='password' id='password' />
                        <span onClick={showPassword}>
                            {isPasswordVisible ? (<FaRegEyeSlash className='relative left-36 bottom-[1.45rem] text-gray-800 cursor-pointer' />) :
                                (<FaRegEye className='relative left-36 bottom-[1.45rem] text-gray-800 cursor-pointer ' />)}

                        </span>
                    </div>
                </div>
            </div>
            <div>
                <button onClick={savePassword} className="save bg-gray-600 border  my-6 py-1 px-5 mx-3 rounded-full flex justify-center  gap-1 items-center text-base"><RiFileLockLine />Save</button>
            </div>
            <div className="passwords w-full">
                <h2 className=' py-3 font-semibold text-lg text-[#ced1d3]'>Your Passwords</h2>
                {passwordArray.length === 0 && <div>No passwords to show</div>}
                {passwordArray.length != 0 && <table className="table-auto w-full mt-2 rounded-md overflow-hidden">
                    <thead className='bg-[#171722] text-white'>
                        <tr>
                            <th className='py-2'>Site</th>
                            <th className='py-2'>Username</th>
                            <th className='py-2'>Password</th>
                            <th className='py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-[#0A0A0A]  w-full'>
                        {passwordArray.map((item, index) => {
                            return <tr key={index}>
                                <td className='text-center w-32 py-2 border border-gray-800 overflow-hidden'> <div className='flex justify-center items-center w-full gap-2' ><a href={item.site} target="_blank"> {item.site}</a><IoCopy onClick={() => { copyText(item.site) }} className=' cursor-pointer' /></div>  </td>
                                <td className='text-center w-32 py-2 border border-gray-800 overflow-hidden'> <div className='flex justify-center items-center w-full gap-2'>{item.username} <IoCopy onClick={() => { copyText(item.username) }} className='cursor-pointer' /></div>  </td>
                                <td className='text-center w-32 py-2 border border-gray-800 overflow-hidden'> <div className='flex justify-center items-center w-full gap-2'>{"*".repeat(item.password.length)} <IoCopy onClick={() => { copyText(item.password) }} className='cursor-pointer' /></div>  </td>
                                <td className='text-center w-32 py-2 border border-gray-800 overflow-hidden'>
                                    <div className='flex justify-center items-center gap-6'>
                                        <CiEdit onClick={()=>{editPassword(item.id)}} className=' cursor-pointer w-5 h-5' />
                                        <MdDeleteOutline onClick={()=>{deletePassword(item.id)}} className=' cursor-pointer w-5 h-5' />
                                    </div>
                                </td>
                            </tr>
                        })}

                    </tbody>
                </table>}
            </div>
            </div>
        </>
    )
}

export default Manager
