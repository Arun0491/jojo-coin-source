import React from 'react';
import Link from "next/link";

const NotFound = () => {
    return (
        <section className="py-10 py-lg-15">
            <div className="container">
                <div className="row justify-center">
                    <div className="col-lg-6">
                        <div className="text-center">
                            <img src="assets/images/error-blue.svg" alt="" className="img-fluid mb-10" />
                            <h2 className="mb-4">Oops! Page Not Found.</h2>
                            <p className="mb-8">
                                The page you are looking for is not available or has been moved. Try a different
                                page or go to the homepage with the button below.
                            </p>
                            <Link href="/" className="btn btn-primary">Go to home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFound;