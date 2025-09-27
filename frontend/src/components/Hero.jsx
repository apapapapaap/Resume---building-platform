import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Download, Eye, Share2 } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Build your perfect</span>{' '}
                <span className="block text-blue-600 xl:inline">resume</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Create professional resumes in minutes with our intuitive builder. 
                Choose from beautiful templates, customize to your heart's content, 
                and download as PDF.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Start Building
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">View Examples</Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Feature highlights */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Download as PDF</h3>
              <p className="mt-2 text-base text-gray-500">
                Export your resume as a professional PDF ready for any application.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Live Preview</h3>
              <p className="mt-2 text-base text-gray-500">
                See your changes in real-time as you build your perfect resume.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Share Online</h3>
              <p className="mt-2 text-base text-gray-500">
                Get a shareable link to showcase your resume online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
