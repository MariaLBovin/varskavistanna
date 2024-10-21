import IconSadFace from "../assets/icons/IconSadFace";
import Button from "../components/Button/Button";

const NotFound = () => {
  const handleBackToHome = () => {
    window.location.href = "/"; 
  };

  return (
    <section className="notFound-wrapper">
      <div className="notFound-text-wrapper">
      <h1 className="notFound-header">Något gick fel</h1>
      <p className="notFound-p">Försök gärna igen!</p>
      </div>
      <IconSadFace />
      <Button variant="primary" text="Tillbaka" onClick={handleBackToHome} />
    </section>
  );
};

export default NotFound;
