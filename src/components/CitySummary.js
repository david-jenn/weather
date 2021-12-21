import { FaTrashAlt, } from 'react-icons/fa';
import { BsArrow90DegUp } from 'react-icons/bs';

function CitySummary({ city, index, fetchData, deleteCity }) {
  return (
    <div className="col-sm-6 mb-2  col-md-6">
      <div className="card border border-dark bg-light" onClick={(evt) => fetchData(evt, city)}>
        
        <div className="card-body d-flex justify-content-between">
          <div>
            <button className="btn btn-primary">
              <BsArrow90DegUp />
            </button>
          </div>
          <div className="fs-4 mb-1text-center">{city}</div>
          <div>
            <button className="btn btn-danger" onClick={(evt) => deleteCity(evt, city, index)}>
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitySummary;
