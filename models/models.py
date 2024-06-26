from sqlalchemy import Column, Integer, String, Float
from db.database import Base

class Data(Base):
    __tablename__ = "data"

    id = Column(Integer, primary_key=True, index=True)
    customer = Column(String, nullable=True)
    product = Column(String, nullable=True)
    length1 = Column(Float, nullable=True)
    length2 = Column(Float, nullable=True)
    length3 = Column(Float, nullable=True)
    width1 = Column(Float, nullable=True)
    width2 = Column(Float, nullable=True)
    width3 = Column(Float, nullable=True)
