'use client'
import { Button, Label, TextInput } from 'flowbite-react'
import { Spinner } from 'flowbite-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useDeviceType from './../../../hooks/useDeviceType'
import { API, Auth_API } from '../../../constant'
import { useAuthContext } from '../../../context/AuthContext'
import { setToken } from '../../../helpers'

const RegisterPage = () => {
  const deviceType = useDeviceType()
  const router = useRouter()
  const [spinner, setSpinner] = useState(false)
  const { setUser }: any = useAuthContext()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required('Required'),
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match',
      ),
    }),
    onSubmit: values => {
      setSpinner(true)
      axios
        .post(`${API}/Auth/register`, values, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
        .then(response => {
          // Navigation to homepage
          console.log(response.data.data)
          setUser(response.data)
          router.push('/')
          // Handle success.
          setSpinner(false)
        })
        .catch(error => {
          // Handle error.
          setSpinner(false)
          console.log('An error occurred:', error.response)
        })
    },
  })

  return (
    <>
      {deviceType == 'desktop' ? (
        <div className='flex w-full gap-4 justify-center items-center mx-auto h-fit m-4 '>
          <form
            onSubmit={formik.handleSubmit}
            className='w-6/12 px-[100px] flex flex-col gap-2'
          >
            <h3 className='text-2xl font-bold whitespace-nowrap'>
              Register at <span className='text-[#444444]'>HighFlix</span>
            </h3>

            <Label
              htmlFor='email'
              value='Email'
              className='text-sm font-normal'
            />
            <TextInput
              id='email'
              name='email'
              type='text'
              placeholder='Enter your email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='text-xs text-red-600 dark:text-red-400'>
                {formik.errors.email}
              </div>
            ) : null}

            <Label
              htmlFor='username'
              value='User name'
              className='text-sm font-normal'
            />
            <TextInput
              id='username'
              name='username'
              type='text'
              placeholder='Enter your password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className='text-xs text-red-600 dark:text-red-400'>
                {formik.errors.username}
              </div>
            ) : null}

            <Label
              htmlFor='password'
              value='Password'
              className='text-sm font-normal'
            />
            <TextInput
              id='password'
              name='password'
              type='password'
              placeholder='Enter your password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='text-xs text-red-600 dark:text-red-400'>
                {formik.errors.password}
              </div>
            ) : null}

            <Label
              htmlFor='confirmPassword'
              value='Confirm password'
              className='text-sm font-normal'
            />
            <TextInput
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='Enter your confirm password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className='text-xs text-red-600 dark:text-red-400'>
                {formik.errors.confirmPassword}
              </div>
            ) : null}

            <div className='flex flex-col gap-2 my-2 items-center'>
              <Link href='/auth/login' className='text-gray-500 italic text-sm'>
                You already have account? Log in!
              </Link>
            </div>

            <Button type='submit' color='dark' size='sm'>
              {spinner ? (
                <div className='flex justify-center items-center gap-4'>
                  <Spinner aria-label='Spinner button example' />
                  <p>Loading...</p>
                </div>
              ) : (
                <>Register</>
              )}
            </Button>
          </form>

          <div className='w-6/12 relative'>
            <Image
              src='/staticImage/uRegisterBg.jpg'
              fill
              style={{
                objectFit: 'contain',
              }}
              alt='Login background'
              className='!static'
            />
          </div>
        </div>
      ) : (
        <>
          <div className='relative'>
            <Image
              src='/staticImage/uRegisterBg.jpg'
              fill
              style={{
                objectFit: 'fill',
              }}
              alt='Login background'
              className='!static !h-[100vh]'
            />
            <form
              onSubmit={formik.handleSubmit}
              className='absolute flex flex-col gap-3 top-[25%] p-6 mx-4 md:p-12 md:mx-32 md:top-[30%] bg-glass backdrop-blur-sm left-0 right-0 text-center rounded-2xl'
            >
              <h3 className='text-xl font-bold whitespace-nowrap'>
                Register at <span className='text-[#444444]'>Code&Art</span>
              </h3>

              <Label
                htmlFor='email'
                value='Email'
                className='text-sm font-normal block text-start'
              />
              <TextInput
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className='text-xs text-red-600 dark:text-red-400 block text-start'>
                  {formik.errors.email}
                </div>
              ) : null}

              <Label
                htmlFor='username'
                value='User name'
                className='text-sm font-normal block text-start'
              />
              <TextInput
                id='username'
                name='username'
                type='text'
                placeholder='Enter your password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className='text-xs text-red-600 dark:text-red-400 block text-start'>
                  {formik.errors.username}
                </div>
              ) : null}

              <Label
                htmlFor='password'
                value='Password'
                className='text-sm font-normal block text-start'
              />
              <TextInput
                id='password'
                name='password'
                type='password'
                placeholder='Enter your password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className='text-xs text-red-600 dark:text-red-400 block text-start'>
                  {formik.errors.password}
                </div>
              ) : null}

              <Label
                htmlFor='confirmPassword'
                value='Confirm password'
                className='text-sm font-normal block text-start'
              />
              <TextInput
                id='confirmPassword'
                name='confirmPassword'
                type='confirmPassword'
                placeholder='Enter your confirm password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className='text-xs text-red-600 dark:text-red-400 block text-start'>
                  {formik.errors.confirmPassword}
                </div>
              ) : null}

              <div className='flex flex-col gap-2 my-2 items-end'>
                <Link
                  href='/auth/login'
                  className='text-gray-500 italic text-sm'
                >
                  You already have account? Log in!
                </Link>
              </div>

              <Button type='submit' color='dark' size='sm'>
                {spinner ? (
                  <>
                    <Spinner aria-label='Spinner button example' />
                    Loading...
                  </>
                ) : (
                  <>Register</>
                )}
              </Button>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default RegisterPage
