from sqlalchemy import Column, Integer, String, Float
from db.database import Base

class Data(Base):
    __tablename__ = "data"

    id = Column(Integer, primary_key=True, index=True)
    customer = Column(String, index=True)
    product = Column(String, index=True)
    length1 = Column(Float)
    length2 = Column(Float)
    length3 = Column(Float)
    width1 = Column(Float)
    width2 = Column(Float)
    width3 = Column(Float)
