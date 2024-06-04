'use client'
import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import Link from 'next/link'
import useDeviceType from './../../../hooks/useDeviceType'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../../context/AuthContext'
import { setToken, setUserId } from '../../../helpers'
import { Auth_API, headerConfig } from '@/constant'

const LoginPage = () => {
  const deviceType = useDeviceType()
  const router = useRouter()
  const [spinner, setSpinner] = useState(false)
  const { setUser }: any = useAuthContext()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      setSpinner(true)
      axios
        .post(`${Auth_API}/login`, values, {
          headers: headerConfig,
        })
        .then(response => {
          // Navigation to homepage
          setUser(response.data)
          //console.log(response.data.userId)
          setToken(response.data.accessToken)
          setUserId(response.data.userId)
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
        <div className='flex w-full gap-4 justify-center items-center mx-auto h-fit m-4'>
          <form
            onSubmit={formik.handleSubmit}
            className='w-6/12 px-[100px] flex flex-col gap-2'
          >
            <h3 className='text-3xl font-bold whitespace-nowrap'>
              Welcome to <span className='text-[#444444]'>HighFlix</span>
            </h3>

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

            <div className='flex flex-row gap-2 items-center justify-center'>
              <Link
                href='/auth/resetPassword'
                className='text-gray-500 italic text-sm'
              >
                Forgot password?
              </Link>
              <Link href='/auth/register' className='italic text-sm'>
                or Register?
              </Link>
            </div>

            <Button type='submit' color='dark' size='sm'>
              {spinner ? (
                <div className='flex justify-center items-center gap-4'>
                  <Spinner aria-label='Spinner button example' />
                  <p>Loading...</p>
                </div>
              ) : (
                <>Login</>
              )}
            </Button>
          </form>

          <div className='w-6/12 relative'>
            <Image
              src='/staticImage/uloginBg-v2.jpg'
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
              src='/staticImage/uloginBg-v2.jpg'
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
                Welcome to <span className='text-[#444444]'>Code&Art</span>
              </h3>

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
                <div className='text-xs text-red-600 dark:text-red-400'>
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
                <div className='text-xs text-red-600 dark:text-red-400'>
                  {formik.errors.password}
                </div>
              ) : null}

              <div className='flex flex-col gap-2 items-end'>
                <Link href='/auth/register' className='italic text-sm'>
                  or Register?
                </Link>
              </div>

              <Button type='submit' color='dark' size='sm'>
                {spinner ? (
                  <div className='flex justify-center items-center gap-4'>
                    <Spinner aria-label='Spinner button example' />
                    <p>Loading...</p>
                  </div>
                ) : (
                  <>Login</>
                )}
              </Button>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default LoginPage
