export default function NewsletterBox() {
    return (
        <> <div className="newsletter-box p-5 text-base">
            <h5 className="title font-medium">Newsletter</h5>
            <p>
                Your email address will not be this published. Required fields
                are News Today.
            </p>
            <form action="#" className="mt-4">
                <div className="input-box">
                    <input type="text" placeholder="Your email address" />
                    <button type="button">SIGN UP</button>
                </div>
            </form>
            <span>We hate spam as much as you do</span>
        </div> </>
    )
}