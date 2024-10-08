"use client";

import React, { useRef, useState, useEffect } from "react";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "@/utils/axios";
import { setCredentials } from "@/context/slices/authSlice.js";

export default function SettingsPage() {
  const [photo, setPhoto] = useState({});
  const [coverphoto, setCoverPhoto] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const photoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [final, setFinal] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/upload-image`,
        formData
      );
      setPhoto(data);
    } catch (e) {
      console.error(e);
      toast.error("Image upload failed!");
    }
  };

  const handleCoverPhotoUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/upload-image`,
        formData
      );
      setCoverPhoto(data);
    } catch (e) {
      console.error(e);
      toast.error("Image upload failed!");
    }
  };

  const handleCoverRemove = async () => {
    try {
      const { data } = await api.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/remove-image`,
        {
          image: coverphoto,
        }
      );
      if (data.status) {
        setCoverPhoto({});
        coverInputRef.current.value = "";
        toast.error("Cover Photo removed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePhotoRemove = async () => {
    try {
      const { data } = await api.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/remove-image`,
        {
          image: photo,
        }
      );
      if (data.status) {
        setPhoto({});
        photoInputRef.current.value = "";
        toast.error("Photo removed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/profile-update`,
        {
          email,
          password,
          name,
          currentPassword,
          photo,
          coverphoto,
          about,
        }
      );

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setEmail("");
        setPassword("");
        setAbout("");
        setCoverPhoto({});
        setName("");
        setPhoto({});
        setCurrentPassword("");
        photoInputRef.current.value = "";
        coverInputRef.current.value = "";
        setFinal(data);
        dispatch(setCredentials(data.user));
        toast.success("Updated!!");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response);
      setLoading(false);
    }
  };

  return (
    <div className="flex  min-h-screen bg-background">
      <div className="flex flex-col w-[92%] mx-auto items-center justify-center gap-5 py-4">
        <h1 className=" text-primary_text !font-bold text-[1.5rem] sm:text-3xl ">
          My Profile Information
        </h1>

        <form
          className="flex flex-col items-center gap-y-5 sm:gap-y-10 rounded-xl p-[18px] bg-shadow "
          onSubmit={handleSubmit}
        >
          {/* image form */}
          <div className="relative flex flex-col items-start gap-4">
            {/* upload cover photo */}
            <div
              className="rounded-xl object-cover
                    
                    w-[17rem] sm:w-[35rem] md:w-[45rem] lg:w-[50rem] xl:w-[70rem] 2xl:w-[87rem] 
                    h-[10rem] sm:h-[15rem]  lg:h-[20rem]"
            >
              {isClient && coverphoto?.url ? (
                <img
                  src={coverphoto.url}
                  alt="Cover Photo"
                  className="w-full h-full object-cover"
                />
              ) : isClient && final?.user?.coverphoto?.url ? (
                <img
                  src={final.user.coverphoto.url}
                  alt="Cover Photo"
                  className="w-full h-full object-cover"
                />
              ) : isClient && user?.coverphoto?.url ? (
                <img
                  src={user.coverphoto.url}
                  alt="Cover Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className=" relative rounded-xl object-cover bg-gray-300 flex items-center justify-center
                  
                  w-[17rem] sm:w-[35rem] md:w-[45rem] lg:w-[50rem] xl:w-[70rem] 2xl:w-[85rem] 
                  h-[10rem] sm:h-[15rem]  lg:h-[20rem]"
                >
                  <span className=" absolute top-2 left-2 ">Cover Photo</span>
                </div>
              )}
            </div>

            <div className="mt-0 flex flex-col gap-1 sm:flex-row items-start sm:items-center">
              <label
                htmlFor="coverImage"
                className="cursor-pointer bg-hover_accent hover:bg-accent text-primary_text font-bold py-2 px-2 sm:px-4 rounded-lg text-[10px] sm:text-base text-center w-1/2 sm:w-full"
              >
                Upload cover photo
              </label>
              <input
                onChange={handleCoverPhotoUpload}
                type="file"
                accept="image/*"
                id="coverImage"
                name="coverImage"
                ref={coverInputRef}
                className="hidden"
              />
              {coverphoto && coverphoto.url && (
                <div className="flex items-center ">
                  <span className="">{coverphoto.name}</span>
                  <DeleteOutlined
                    onClick={handleCoverRemove}
                    className="cursor-pointer text-red-500 hover:text-red-600"
                  />
                </div>
              )}
            </div>

            {/* upload profile photo*/}
            <div
              className="flex absolute left-0 right-0 flex-col items-center gap-1
            
              top-[6.5rem] sm:top-[10.5rem] md:top-[8.5rem] lg:top-[13.5rem] 
              mx-16 sm:mx-[13rem]  "
            >
              <div
                className="rounded-full overflow-hidden border-4 sm:border-8 border-shadow object-cover
                      flex items-center justify-center
                      w-[6rem] sm:w-[8rem] md:w-[12rem] 
                      h-[6rem] sm:h-[8rem] md:h-[12rem] "
              >
                {isClient && photo?.url ? (
                  <img
                    src={photo.url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : isClient && final?.user?.photo?.url ? (
                  <img
                    src={final.user.photo.url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : isClient && user?.photo?.url ? (
                  <img
                    src={user.photo.url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar
                    name={final?.user?.name || user?.name || "User"}
                    size="192"
                    round
                    className="cursor-pointer"
                  />
                )}
              </div>
              <div className="mt-0 flex  items-center justify-center  gap-1">
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer bg-hover_accent hover:bg-accent text-primary_text font-bold py-2 px-2 md:px-4 rounded-lg text-[10px] sm:text-base text-center w-full"
                >
                  Upload profile photo
                </label>
                <input
                  onChange={handlePhotoUpload}
                  type="file"
                  accept="image/*"
                  id="profileImage"
                  name="profileImage"
                  ref={photoInputRef}
                  className="hidden"
                />
                {photo && photo.url && (
                  <div className="flex items-center">
                    <span className="">{photo.name}</span>
                    <DeleteOutlined
                      onClick={handlePhotoRemove}
                      className="cursor-pointer text-red-500 hover:text-red-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* text form */}
          <div className="flex flex-col pt-5 sm:pt-10 md:pt-16 w-full gap-y-5 sm:gap-y-10">
            <div className=" flex flex-col gap-y-2">
              <h1 className="!text-primary_text">Full Name</h1>
              {isClient && (
                <input
                  shape="rounded"
                  type="text"
                  name="fullName"
                  placeholder={user.name}
                  className="flex-grow bg-shadow h-10 pl-2 !text-primary_text w-full text-[13px] sm:text-[1rem] border rounded-lg border-hover_accent focus:outline-none focus:ring-1 focus:ring-hover_accent outline-none  transition-all resize-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
            </div>
            <div className=" flex flex-col gap-y-2">
              <h1 className="!text-primary_text">Email Address</h1>
              {isClient && (
                <input
                  shape="rounded"
                  type="email"
                  name="email"
                  placeholder={user.email}
                  className="flex-grow bg-shadow !text-primary_text w-full text-[13px] sm:text-[1rem] border rounded-lg border-hover_accent focus:outline-none focus:ring-1 focus:ring-hover_accent outline-none h-10 pl-2 transition-all resize-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </div>
            <div className=" flex flex-col gap-y-2">
              <h1 className="!text-primary_text">Old Password</h1>
              <input
                shape="rounded"
                type="password"
                name="oldpassword"
                placeholder="***********"
                className="flex-grow bg-shadow !text-primary_text w-full text-[13px] sm:text-[1rem] border rounded-lg border-hover_accent focus:outline-none focus:ring-1 focus:ring-hover_accent outline-none h-10 pl-2 transition-all resize-none"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className=" flex flex-col gap-y-2">
              <h1 className="!text-primary_text">New Password</h1>
              <input
                shape="rounded"
                type="password"
                name="newpassword"
                placeholder="***********"
                className="flex-grow bg-shadow !text-primary_text w-full text-[13px] sm:text-[1rem] border rounded-lg border-hover_accent focus:outline-none focus:ring-1 focus:ring-hover_accent outline-none h-10 pl-2 transition-all resize-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className=" flex flex-col gap-y-2">
              <h1 className="!text-primary_text">About</h1>
              {isClient && (
                <textarea
                  shape="rounded"
                  type="text"
                  name="about"
                  placeholder={user.about}
                  className="flex-grow bg-shadow !text-primary_text w-full text-[13px] sm:text-[1rem] border rounded-lg border-hover_accent focus:outline-none focus:ring-1 focus:ring-hover_accent outline-none pl-2 transition-all resize-none h-[100px]"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* update button */}
          <button
            type="submit"
            className="cursor-pointer bg-hover_accent hover:bg-accent text-primary_text font-bold py-2 px-4 rounded-lg text-[13px] sm:text-base"
            disabled={loading}
          >
            {loading ? (
              <SyncOutlined spin className="py-1" />
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
