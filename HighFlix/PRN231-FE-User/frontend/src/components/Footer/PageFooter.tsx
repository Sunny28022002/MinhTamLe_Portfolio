'use client'
import { Footer } from 'flowbite-react'
import { FooterLinkData } from '../../../public/staticData/FooterLinkData'

export default function FooterWithSocialMediaIcons() {
  return (
    <>
      <Footer.Divider className='border' />
      <Footer container className='!shadow-none'>
        <div className='w-full'>
          <div className='w-full flex flex-col gap-16'>
            <div className='flex flex-col gap-4'>
              <div className='text-center font-bold text-2xl'>
                HighFlix
              </div>
              <div className='text-center text-sm italic'>
                Do not Let Fear Get in Your Way
              </div>
            </div>
            <div className='flex flex-col md:flex-row justify-center text-center gap-8'>
              {FooterLinkData.map((item, index) => (
                <div key={index}>
                  <Footer.Title title={item.title} className='normal-case' />
                  <Footer.LinkGroup col>
                    {item.navLink.map((item, index) => (
                      <Footer.Link key={index} href={item.url} className='md:mr-0'>
                        {item.title}
                      </Footer.Link>
                    ))}
                  </Footer.LinkGroup>
                </div>
              ))}
            </div>
          </div>
          <Footer.Divider className='border' />
          <div className='text-center text-xs'>
            <a href='#'>Privacy Policy</a>&nbsp;- highflix &copy; - All
            Rights Reserved.
          </div>
        </div>
      </Footer>
    </>
  )
}
